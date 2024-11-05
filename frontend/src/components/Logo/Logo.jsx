import { Link } from 'react-router-dom';

import { media } from '../../utils/mediaConfig';

export default function Logo({ isFooter }) {
  return (
    <Link to="/">
      <img
        width="101px"
        height="44px"
        src={
          isFooter ? `${media}/logo/logo_dark.svg` : `${media}/logo/Logo.svg`
        }
        alt="Logotype"
      />
    </Link>
  );
}
