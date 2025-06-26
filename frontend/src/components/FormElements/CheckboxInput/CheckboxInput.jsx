import { FaCheck } from 'react-icons/fa';

import css from './CheckboxInput.module.css';
import { styled } from '@mui/material';

export default function CheckboxInput({
  id,
  name,
  checked,
  onChange,
  label,
  icon,
  variant = 'default', // 'default' | 'image'
  width,
}) {
  const inputId = id || `${name}-checkbox`;

  return (
    <label className={variant === 'default' ? css.checkboxWrapper : ''}>
      <input
        id={inputId}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={css.visuallyHidden}
      />

      <div htmlFor={inputId} className={css.checkboxLabel}>
        {variant === 'image' ? (
          <div
            className={`${css.imgWrapper} ${checked ? css.selected : ''}`}
            style={{
              width: width,
            }}
          >
            <span className={css.iconWrapper}>
              <FaCheck className={css.checkmarkIcon} />
            </span>
            <span className={css.bgImage}>{icon?.()}</span>
          </div>
        ) : (
          <>
            <span className={css.iconWrapper}>
              {checked && <FaCheck className={css.checkmarkIcon} />}
            </span>
            {label && <span className={css.labelText}>{label}</span>}
          </>
        )}
      </div>
    </label>
  );
}
