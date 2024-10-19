import { useDispatch } from 'react-redux';
import { fetchGoogleAuthUrl } from '../../redux/auth/operations';
import { FcGoogle } from 'react-icons/fc';
import css from './GoogleAuthBtn.module.css';

export default function GoogleAuthBtn() {
  const dispatch = useDispatch();

  const handleLoginWithGoogle = async () => {
    try {
      const googleAuthUrl = await dispatch(fetchGoogleAuthUrl()).unwrap();

      window.location.href = googleAuthUrl;
    } catch (e) {
      console.error('Error fetching Google Auth URL:', e);
    }
  };

  return (
    <div>
      <button
        type="button"
        className={css.socialButton}
        onClick={handleLoginWithGoogle}
      >
        <FcGoogle className={css.googleIcon} />
        Google
      </button>
    </div>
  );
}
