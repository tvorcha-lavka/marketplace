import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';

import { authReducer } from './auth/slice';
import { categoriesReducer } from './categories/categoriesSlice';
import { productReducer } from './products/slice';
import { filtersReducer } from './filters/filtersSlice';
import { basketReducer } from './basket/slice';
import { advertReducer } from './addAdverts/slice';
import { usersReducer } from './users/slice';
import { paymentReducer } from './paymentUserCards/slice';

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
    whitelist: ['products', 'searchResults', 'query', 'searchHistory'],
  },
  productReducer
);

const persistedAdvertReducer = persistReducer(
  {
    key: 'advert',
    storage,
    whitelist: [
      'selectedCategory',
      'selectedSubCategory',
      'selectedChildCategory',
      'selectedFilters',
      'selectedColors',
      'isSelectedDelivery',
      'isCategoryConfirmed',
      'title',
      'description',
      'price',
    ],
  },
  advertReducer
);

const persistedBasketReducer = persistReducer(
  {
    key: 'basket',
    storage,
    whitelist: ['items', 'total', 'customerData', 'step'],
  },
  basketReducer
);

const persistedUsersReducer = persistReducer(
  {
    key: 'users',
    storage,
    whitelist: [
      'list',
      'selectedUser',
      'isEditingPersonal',
      'isEditingSecurity',
    ],
  },
  usersReducer
);

const persistedPaymentReducer = persistReducer(
  {
    key: 'payment',
    storage,
    whitelist: ['cards', 'mainCardIndex'],
  },
  paymentReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    categories: persistedCategoriesReducer,
    product: persistedProductsReducer,
    advert: persistedAdvertReducer,
    basket: persistedBasketReducer,
    filters: filtersReducer,
    users: persistedUsersReducer,
    payment: persistedPaymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
