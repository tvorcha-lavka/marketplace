import { useState } from 'react';
import { Field } from 'formik';
import clsx from 'clsx';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import {
  PwdStrengthLength,
  getStrengthLabel,
} from '../PwdStrengthLength/PwdStrengthLength';

import css from './PasswordField.module.css';

export default function PasswordField({
  id,
  values = {},
  setFieldValue,
  children,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const type = showPassword ? 'text' : 'password';

  const togglePassInput = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFieldValue('password', password);

    if (password === '') {
      setStrengthLabel('');
      setShowInfo(false);
    } else {
      const strength = getStrengthLabel(password);
      setStrengthLabel(strength);
      setShowInfo(true);
    }
  };

  return (
    <>
      <div className={css.pwdFieldWrap}>
        <label className={css.pwdFieldLabel} htmlFor={`${id}-password`}>
          {children} <span className={css.requiredSymb}>&#42;</span>
        </label>

        <div className={css.wrap}>
          <Field
            id={`${id}-password`}
            name="password"
            className={clsx(
              css.pwdField,
              values.password && css.pwdFieldFilled
            )}
            type={type}
            placeholder="password"
            autoComplete="off"
            onChange={handlePasswordChange}
          />

          {showPassword ? (
            <FiEye onClick={togglePassInput} className={css.fiEye} />
          ) : (
            <FiEyeOff onClick={togglePassInput} className={css.fiEyeOff} />
          )}
        </div>

        {showInfo && <PwdStrengthLength strengthLabel={strengthLabel} />}
      </div>

      {showInfo && (
        <p className={css.additionalInfo}>
          Пароль має складатись з мін. 8 та макс. 128 символів, цифр і
          спеціальних знаків
        </p>
      )}
    </>
  );
}
