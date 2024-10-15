import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import { toast } from 'react-hot-toast';
import { refreshUser, logOut } from '../auth/operations';

const jwtRefreshMiddleware = ({ dispatch, getState }) => {
  return (next) => (action) => {
    if (typeof action === 'function') {
      const access_token = getState().auth.accessToken;
      if (access_token) {
        const decoded = jwtDecode(access_token);
        if (decoded.exp && decoded.exp - moment().unix() < 10) {
          dispatch(refreshUser())
            //return Promise.reject(new Error('Simulated refresh error'))
            .then(() => {
              return next(action);
            })
            .catch((error) => {
              toast.error('Session expired, logging out...');
              console.log('Logging out due to refresh error');
              return dispatch(logOut());
            });
        }
      }
    }
    return next(action);
  };
};

export default jwtRefreshMiddleware;
