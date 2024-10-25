import { useDispatch } from 'react-redux';
import { FaFacebook } from 'react-icons/fa';

import { fetchFacebookAuthUrl } from '../../redux/auth/operations';

import css from './FacebookAuthBtn.module.css';

export default function FacebookAuthBtn() {
  const dispatch = useDispatch();

  const handleFacebookLogin = async () => {
    try {
      const facebookAuthUrl = await dispatch(fetchFacebookAuthUrl()).unwrap();

      window.location.href = facebookAuthUrl;
    } catch (e) {
      console.error('Failed to fetch Facebook Auth URL:', e);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleFacebookLogin}
        className={css.socialButton}
      >
        <FaFacebook className={css.facebookIcon} />
        Facebook
      </button>
    </div>
  );
}
