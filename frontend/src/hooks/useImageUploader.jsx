import { useEffect, useRef } from 'react';

import showToast from '../components/Toasts/showToast';

export function useImageUploader() {
  const wsUrl = 'ws://localhost:9000/image/upload';
  const dbName = 'ImageUploadDB';
  const storeName = 'images';

  const wsRef = useRef(null);
  const uploadsCount = useRef(0);
  const activeAction = useRef(null);
  const activeFileUpload = useRef(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('userId', userId);
    }
    return userId;
  }

  function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'index' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function saveFileToDB(index, file, storedFileName) {
    return openDB().then((db) => {
      return new Promise((resolve, reject) => {
        const dbKey = `${index}-${getSessionId()}`;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put({ index: dbKey, file, storedFileName });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  }

  function getWebSocket() {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => console.log('WebSocket відкрито');

      wsRef.current.onerror = (error) => {
        console.error('WebSocket помилка:', error);
        showToast(
          'Не вдалося підключитися до сервера завантаження зображень.',
          'error'
        );
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket закрито');
        wsRef.current = null;
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.status === 'success') {
          if (activeAction.current?.type === 'upload') {
            const { index, file } = activeAction.current;
            await saveFileToDB(index, file, data.file_name);
            activeAction.current.resolve?.();
          }

          if (activeAction.current?.type === 'delete') {
            await deleteFileFromDB(activeAction.current.index);
            activeAction.current.onSuccess?.();
          }
        } else {
          if (activeAction.current?.type === 'delete') {
            activeAction.current.onError?.(data.message);
          }

          if (activeAction.current?.type === 'upload') {
            activeAction.current.resolve?.();
          }
        }
      };
    }

    return wsRef.current;
  }

  function handleServerResponse(event, resolve) {
    const data = JSON.parse(event.data);

    if (activeAction.current?.type === 'upload') {
      if (data.status === 'success') {
        const { index, file } = activeAction.current;
        saveFileToDB(index, file, data.file_name);
        resolve?.();
      } else {
        resolve?.();
      }
    }
  }

  function sendFile(file) {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const chunkSize = 1024 * 256;
      const data = event.target.result;
      let offset = 0;

      while (offset < data.byteLength && activeFileUpload.current) {
        const chunk = data.slice(offset, offset + chunkSize);

        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(chunk);
        }

        offset += chunkSize;
      }

      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(new TextEncoder().encode('EOF'));
      }
    };

    reader.readAsArrayBuffer(file);
  }

  function uploadFile(file, index) {
    const ws = getWebSocket();

    return new Promise((resolve) => {
      activeAction.current = { type: 'upload', file, index, resolve };
      activeFileUpload.current = { file, index };

      const sendUploadRequest = () => {
        ws.send(
          JSON.stringify({
            action: 'upload',
            user_id: getUserId(),
            session_id: getSessionId(),
            file_name: file.name,
            file_idx: index,
          })
        );
        sendFile(file);
        uploadsCount.current += 1;
        sessionStorage.setItem('uploads', uploadsCount.current);
      };

      if (ws.readyState === WebSocket.OPEN) {
        sendUploadRequest();
      } else if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener('open', sendUploadRequest, { once: true });
      }
    });
  }

  function getFileFromDB(index) {
    return openDB().then((db) => {
      return new Promise((resolve, reject) => {
        const dbKey = `${index}-${getSessionId()}`;
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(dbKey);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  function deleteFileFromDB(index) {
    return openDB().then((db) => {
      return new Promise((resolve, reject) => {
        const dbKey = `${index}-${getSessionId()}`;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(dbKey);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  }

  function deleteFile(index, onSuccess, onError) {
    getFileFromDB(index).then((result) => {
      const fileName = result?.storedFileName;
      if (!fileName) {
        showToast('Файл не знайдено в базі даних.', 'error');
        return;
      }

      const ws = getWebSocket();

      activeAction.current = { type: 'delete', index, onSuccess, onError };

      const sendDeleteRequest = () => {
        ws.send(
          JSON.stringify({
            action: 'delete',
            user_id: getUserId(),
            session_id: getSessionId(),
            file_name: fileName,
            file_idx: index,
          })
        );
      };

      if (ws.readyState === WebSocket.OPEN) {
        sendDeleteRequest();
      } else if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener('open', sendDeleteRequest, { once: true });
      }
    });
  }

  return {
    uploadFile,
    deleteFile,
    getFileFromDB,
    deleteFileFromDB,
  };
}
