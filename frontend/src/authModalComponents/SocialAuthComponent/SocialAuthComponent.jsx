import { useDispatch } from 'react-redux';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import {
  fetchFacebookAuthUrl,
  fetchGoogleAuthUrl,
} from '../../redux/auth/operations';

import css from './SocialAuthComponent.module.css';

export default function SocialAuthComponent() {
  const dispatch = useDispatch();

  const handleFacebookLogin = async () => {
    try {
      const facebookAuthUrl = await dispatch(fetchFacebookAuthUrl()).unwrap();
      window.location.href = facebookAuthUrl;
    } catch (e) {
      console.error('Failed to fetch Facebook Auth URL:', e);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleAuthUrl = await dispatch(fetchGoogleAuthUrl()).unwrap();
      window.location.href = googleAuthUrl;
    } catch (e) {
      console.error('Error fetching Google Auth URL:', e);
    }
  };

  return (
    <>
      <ul className={css.socialButtons}>
        <li>
          <button
            type="button"
            onClick={handleFacebookLogin}
            className={css.socialButton}
          >
            <FaFacebook className={css.icon} />
            Facebook
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className={css.socialButton}
          >
            <FcGoogle className={css.icon} />
            Google
          </button>
        </li>
      </ul>
      <span className={css.divider}>або</span>
    </>
  );
}
