import css from './PwdStrengthLength.module.css';

export const PwdStrengthLength = ({ strengthLabel }) => {
  return (
    <div className={css.pwdStrengthContainer}>
      <ul className={css.strengthLengthWrap}>
        {Array.from({ length: strengthLabel.lines }).map((_, index) => (
          <li
            key={index}
            className={css.pwdStrengthLength}
            style={{ backgroundColor: strengthLabel.color }}
          />
        ))}
      </ul>
      <span className={css.strengthLabel}>{strengthLabel.label}</span>
    </div>
  );
};

export const getStrengthLabel = (password) => {
  const length = password.length;
  if (length < 8)
    return {
      label: 'Слабкий пароль',
      color: 'var(--error-red)',
      lines: 1,
    };
  if (length < 12)
    return {
      label: 'Помірно складний пароль',
      color: 'var(--warning-orange)',
      lines: 2,
    };
  return {
    label: 'Надійний пароль',
    color: 'var(--success-green)',
    lines: 3,
  };
};
