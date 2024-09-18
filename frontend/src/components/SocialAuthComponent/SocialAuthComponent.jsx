import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import css from './SocialAuthComponent.module.css';

export default function SocialAuthComponent() {
  return (
    <>
      <ul className={css.socialButtons}>
        <li>
          <button type="button" className={css.socialButton}>
            <FaFacebook className={css.facebookIcon} />
            Facebook
          </button>
        </li>
        <li>
          <button type="button" className={css.socialButton}>
            <FcGoogle className={css.googleIcon} />
            Google
          </button>
        </li>
      </ul>
      <span className={css.divider}>або</span>
    </>
  );
}
