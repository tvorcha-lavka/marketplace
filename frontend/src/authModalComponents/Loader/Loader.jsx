import { Oval } from 'react-loader-spinner';

import { media } from '../../utils/mediaConfig';

import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.loaderWrapper}>
      <div className={css.loader}>
        <Oval
          visible={true}
          height="164"
          width="164"
          strokeWidth={1.8}
          strokeWidthSecondary={1.8}
          color="var(--primary-yellow)"
          secondaryColor="var(--primary-yellow-light)"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <img
          src={`${media}/logo/Logo.svg`}
          width="101px"
          height="44px"
          alt="Logo"
          className={css.logo}
        />
        <p className={css.loaderText}>Обробка запиту...</p>
      </div>
    </div>
  );
}
