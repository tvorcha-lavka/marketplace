import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  logInWithFacebookComplete,
  logInWithGoogleComplete,
} from '../../redux/auth/operations';

export default function SocialAuthHandler({ provider }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code || !state) {
      console.error('Code or state not found in URL params');
      navigate('/');
      return;
    }

    if (provider === 'google') {
    } else if (provider === 'facebook') {
    }
		if (code && state) {
			
      let loginAction;

      if (provider === 'google') {
        loginAction = logInWithGoogleComplete;
      } else if (provider === 'facebook') {
        loginAction = logInWithFacebookComplete;
      }

      if (loginAction) {
        dispatch(loginAction({ code, state }))
          .unwrap()
          .then(() => {
            navigate('/');
          })
          .catch((e) => {
            console.error(`${provider} login error:`, e);
            navigate('/');
          });
      }
    }
  }, [dispatch, navigate, provider]);
  return null;
}
