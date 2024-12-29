import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/slice';
import { categoriesReducer } from './categories/categoriesSlice';
import { productReducer } from './products/slice';
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

const persistedCategoriesReducer = persistReducer(
  {
    key: 'categories',
    storage,
    whitelist: ['categoryById'],
  },
  categoriesReducer
);

const persistedProductsReducer = persistReducer(
  {
    key: 'product',
    storage,
    whitelist: ['products'],
  },
  productReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    categories: persistedCategoriesReducer,
    product: persistedProductsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
