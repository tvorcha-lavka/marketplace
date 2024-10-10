import axios from 'axios';
import { logOut, refreshUser } from './operations';
import { store } from '../store';

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const clearAuthHeader = () => {
  delete axios.defaults.headers.common.Authorization;
};

axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      clearAuthHeader();
      window.location.href = '/';
      return Promise.reject(error);
    }

    if (!originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const resultAction = await store.dispatch(refreshUser());

          if (refreshUser.fulfilled.match(resultAction)) {
            const { access } = resultAction.payload;

            localStorage.setItem('accessToken', access);

            axios.defaults.headers.common.Authorization = `Bearer ${access}`;
            originalRequest.headers.Authorization = `Bearer ${access}`;

            return axios(originalRequest);
          } else {
            store.dispatch(logOut());
            return Promise.reject(new Error('Refresh token failed'));
          }
        } catch (refreshError) {
          store.dispatch(logOut());
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
