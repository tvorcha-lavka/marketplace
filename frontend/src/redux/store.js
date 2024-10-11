import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/slice';
import { categoriesReducer } from './categories/categoriesSlice';
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const persistedAuthReducer = persistReducer(
  {
    key: 'auth',
    storage,
    whitelist: ['accessToken', 'refreshToken'],
  },
  authReducer
);

const modalMiddleware = (modalContext) => (storeAPI) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(storeAPI.dispatch, storeAPI.getState, modalContext);
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(modalMiddleware({})),
});

export const persistor = persistStore(store);
