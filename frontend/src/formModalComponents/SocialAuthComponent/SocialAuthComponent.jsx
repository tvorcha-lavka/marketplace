import FacebookAuthBtn from '../FacebookAuthBtn/FacebookAuthBtn';
import GoogleAuthBtn from '../GoogleAuthBtn/GoogleAuthBtn';
import css from './SocialAuthComponent.module.css';

export default function SocialAuthComponent() {
  return (
    <>
      <ul className={css.socialButtons}>
        <li>
          <FacebookAuthBtn />
        </li>
        <li>
          <GoogleAuthBtn />
        </li>
      </ul>
      <span className={css.divider}>або</span>
    </>
  );
}
