const DB_NAME = 'MarketplaceDB';
const DB_VERSION = 1;
const STORE_NAME = 'filters';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'productId' });
      }
    };
  });
}

export async function saveFilters(productId, userId, filters) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  store.put({ productId, userId, filters });

  return tx.complete;
}

export async function getFilters(productId) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(productId);
    request.onsuccess = () => resolve(request.result?.filters ?? []);
    request.onerror = () => reject(request.error);
  });
}
