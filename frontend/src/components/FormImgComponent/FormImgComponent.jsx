import css from './FormImgComponent.module.css';

export default function FormImgComponent() {
  return (
    <img
      className={css.formImage}
      srcSet="../../../public/images/form@1x.png 1x, ../../../public/images/form@2x.png 2x"
      src="../../../public/images/form@1x.png"
      alt="Form Image"
    />
  );
}
