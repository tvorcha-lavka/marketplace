import { ButtonStyled, TransparentButtonStyled } from './CustomButton.styled';

export default function CustomButton({
  children,
  size,
  onClick,
  className,
  disabled,
  type = 'button',
  variant = 'default',
}) {
  const ButtonComponent =
    variant === 'another' ? TransparentButtonStyled : ButtonStyled;

  return (
    <ButtonComponent
      size={size}
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={type}
    >
      {children}
    </ButtonComponent>
  );
}
