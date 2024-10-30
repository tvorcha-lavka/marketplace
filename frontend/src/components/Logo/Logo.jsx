import { Link } from 'react-router-dom';

export default function Logo({ isFooter }) {
  return (
    <Link to="/">
      <img
        width="101px"
        height="44px"
        src={isFooter ? '/images/logo_dark.png' : '/images/logo.png'}
        alt="Logotype"
      />
    </Link>
  );
}
