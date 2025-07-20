import axios from 'axios';
import { store } from './store';
import { refreshUser } from './auth/operations';
import { setRefreshing, updateTokens, setSessionExpired } from './auth/slice';

export const baseApiUrl = import.meta.env.VITE_API_URL;

export const saveTokensToStorage = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const validateTokensOnPageReload = async () => {
  const savedAccessToken = localStorage.getItem('accessToken');
  const savedRefreshToken = localStorage.getItem('refreshToken');

  if (savedAccessToken && savedRefreshToken) {
    setAuthHeader(savedAccessToken);

    store.dispatch(
      updateTokens({
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken,
      })
    );

    await store.dispatch(refreshUser());
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
          store.dispatch(setSessionExpired(true));
          return Promise.reject(error);
        }

        if (!reduxState.auth.isRefreshing) {
          store.dispatch(setRefreshing(true));

          try {
            const refreshResult = await store.dispatch(refreshUser());

            if (refreshResult.meta.requestStatus === 'fulfilled') {
              const { accessToken } = store.getState().auth;
              setAuthHeader(accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              store.dispatch(setRefreshing(false));
              return axios(originalRequest);
            } else {
              store.dispatch(setSessionExpired(true));
              store.dispatch(setRefreshing(false));
              return Promise.reject(error);
            }
          } catch (refreshError) {
            store.dispatch(setSessionExpired(true));
            store.dispatch(setRefreshing(false));
            return Promise.reject(refreshError);
          }
        }
      }

      return Promise.reject(error);
    }
  );
};
