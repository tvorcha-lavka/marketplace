import axios from 'axios';
import { store } from './store';
import { logOut, refreshUser } from './auth/operations';
import { setRefreshing, updateTokens } from './auth/slice';

export const baseApiUrl = import.meta.env.VITE_API_URL;

export const saveTokensToStorage = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const validateTokensOnPageReload = () => {
  const savedAccessToken = localStorage.getItem('accessToken');
  const savedRefreshToken = localStorage.getItem('refreshToken');

  if (savedAccessToken) {
    setAuthHeader(savedAccessToken);

    store.dispatch(
      updateTokens({
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken,
      })
    );
  }
};

export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const reduxState = store.getState();

      if (reduxState.auth.isLoggedOut) {
        return Promise.reject(error);
      }

      if (!originalRequest.headers.Authorization) {
        return Promise.reject(error);
      }

      if (error.response && error.response.status === 401) {
        if (originalRequest.url.includes('/auth/token/refresh/')) {
          store.dispatch(logOut());
          return Promise.reject(error);
        }

        if (!reduxState.auth.isRefreshing) {
          store.dispatch(setRefreshing(true));

          try {
            await store.dispatch(refreshUser());
            store.dispatch(setRefreshing(false));
            return;
          } catch (refreshError) {
            store.dispatch(logOut());
            return Promise.reject(refreshError);
          }
        }
      }

      return Promise.reject(error);
    }
  );
};
