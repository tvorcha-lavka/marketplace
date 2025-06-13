import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { GoAlert } from 'react-icons/go';

function showErrorToast(message) {
  toast.custom(() => (
    <div
      style={{
        backgroundColor: 'var(--error-red)',
        color: 'var(--default-white)',
        width: '450px',
        height: '100px',
        padding: '15px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: 'var(--font-size-tiny)',
        fontWeight: 'var(--font-weight-bold)',
        borderLeft:
          'var(--border-width-biggest) var(--border-style) var(--primary-yellow)',
        boxShadow: 'var(--cart-shadow)',
      }}
    >
      <GoAlert
        style={{
          width: 'var(--icon-size-large)',
          height: 'var(--icon-size-large)',
          fontSize: '32px',
          color: 'var(--default-white)',
        }}
      />
      {message}
    </div>
  ));
}

export function useImageUploader() {
  const wsUrl = 'ws://localhost:9000/image/upload';
  const dbName = 'ImageUploadDB';
  const storeName = 'images';
  const maxFiles = 10;
  const maxSize = 5 * 1024 * 1024;

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
      wsRef.current.onerror = (error) =>
        console.error('WebSocket помилка:', error);
      wsRef.current.onclose = (event) => {
        console.warn('WebSocket закрито:', event.code, event.reason);
      };
      wsRef.current.onerror = (error) => {
        console.error('WebSocket помилка:', error);
        showErrorToast(
          'Не вдалося підключитися до сервера завантаження зображень.'
        );
      };
      wsRef.current.onclose = () => {
        console.log('WebSocket закрито');
        wsRef.current = null;
      };
    }

    return wsRef.current;
  }

  function handleServerResponse(event, resolve) {
    const data = JSON.parse(event.data);

    if (activeAction.current?.type === 'upload') {
      resolve?.();
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

        await new Promise((resolve) => {
          wsRef.current.onmessage = (event) =>
            handleServerResponse(event, resolve);
          if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(chunk);
          }
        });

        offset += chunkSize;
      }

      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(new TextEncoder().encode('EOF'));
      }
    };

    reader.readAsArrayBuffer(file);
  }

  function uploadFile(file, index) {
    if (uploadsCount.current >= maxFiles) {
      showErrorToast('Перевищено ліміт завантажень!');
      return;
    }

    if (file.size > maxSize) {
      showErrorToast('Файл перевищує 5 МБ!');
      return;
    }

    const ws = getWebSocket();

    activeAction.current = { type: 'upload', file, index };
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
  }

  return {
    uploadFile,
  };
}
