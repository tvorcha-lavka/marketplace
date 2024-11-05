import { media } from '../../utils/mediaConfig';

import css from './FormImgComponent.module.css';

export default function FormImgComponent() {
  return (
    <img
      className={css.formImage}
      srcSet={`${media}/page/auth/form%401x.png 1x, ${media}/page/auth/form%402x.png 2x`}
      src={`${media}/page/auth/form%401x.png`}
      alt="Tvorcha Lavka auth form image"
    />
  );
}
