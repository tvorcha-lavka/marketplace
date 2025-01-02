import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/slice';
import { categoriesReducer } from './categories/categoriesSlice';
import { productReducer } from './products/slice';
import basketReducer from './basket/slice';
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

const persistedBasketReducer = persistReducer(
  {
    key: 'basket',
    storage,
    whitelist: ['items', 'total'],
  },
  basketReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    categories: persistedCategoriesReducer,
    product: persistedProductsReducer,
    basket: persistedBasketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
