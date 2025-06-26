import css from './ToggleButton.module.css';

export default function ToggleButton({
  onClick,
  owner,
  isSwitchActive,
  label = '',
  style,
}) {
  return (
    <div className={css.switch} style={style}>
      <button
        type="button"
        className={`${css.toggle} ${isSwitchActive ? css.active : ''}`}
        onClick={() => onClick?.(owner)}
        aria-pressed={isSwitchActive}
      />
      {label && <span className={css.label}>{label}</span>}
    </div>
  );
}
