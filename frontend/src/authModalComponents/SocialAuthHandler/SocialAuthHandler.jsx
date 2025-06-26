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

    const loginActions = {
      google: logInWithGoogleComplete,
      facebook: logInWithFacebookComplete,
    };

    const loginAction = loginActions[provider];

    if (!loginAction) {
      navigate('/');
      return;
    }

    dispatch(loginAction({ code, state }))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        navigate('/');
      });
  }, [dispatch, navigate, provider, location]);

  return null;
}
