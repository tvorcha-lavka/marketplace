import { useState } from 'react';
import { Field } from 'formik';
import clsx from 'clsx';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import {
  PwdStrengthLength,
  getStrengthLabel,
} from '../../../utils/PwdStrengthLength/PwdStrengthLength';

import css from '../../FormElements/FormFieldStyles.module.css';

export default function PasswordField({
  id,
  name = 'password',
  values = {},
  setFieldValue,
  label,
  inputWidth,
  disabled,
  showLabel = true,
  touched = {},
  errors = {},
  inputError = {},
  showStrengthLabel = true,
  showAdditionalInfo = true,
  showForgotPasswordLink = false,
  onForgotPasswordClick = () => {},
  customErrorMessage,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const type = showPassword ? 'text' : 'password';
  const fieldValue = values?.[name] || '';
  const hasError = (errors?.[name] && touched?.[name]) || inputError?.[name];
  const isFilled = fieldValue && !errors?.[name];

  const togglePassInput = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    const newVal = e.target.value;
    setFieldValue(name, newVal);

    if (newVal === '') {
      setStrengthLabel('');
      setShowInfo(false);
    } else {
      const strength = getStrengthLabel(newVal);
      setStrengthLabel(strength);
      setShowInfo(true);
    }
  };

  return (
    <>
      <div className={css.fieldWrapper}>
        <div className={css.labelWrap}>
          {showLabel && (
            <label className={css.fieldLabel} htmlFor={`${id}-password`}>
              {label} <span className={css.requiredSymb}>&#42;</span>
            </label>
          )}

          {showForgotPasswordLink && (
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className={css.resetPwd}
            >
              Забули пароль?
            </button>
          )}
        </div>

        <div className={css.wrap}>
          <Field
            id={`${id}-password`}
            name={name}
            type={type}
            placeholder="password"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            onChange={handlePasswordChange}
            disabled={disabled}
            className={clsx(
              css.formInput,
              hasError && css.fieldInputError,
              isFilled && css.fieldInputFilled
            )}
            style={{
              width: inputWidth,
            }}
          />

          {showPassword ? (
            <FiEye
              onClick={togglePassInput}
              className={clsx(
                css.eyeIcon,
                hasError && css.eyeError,
                isFilled && css.eyeFilled
              )}
            />
          ) : (
            <FiEyeOff
              onClick={togglePassInput}
              className={clsx(
                css.eyeIcon,
                hasError && css.eyeError,
                isFilled && css.eyeFilled
              )}
            />
          )}
        </div>

        {showStrengthLabel && showInfo && (
          <PwdStrengthLength strengthLabel={strengthLabel} />
        )}

        {customErrorMessage && (
          <p className={css.additionalInfoError}>{customErrorMessage}</p>
        )}
      </div>

      {showAdditionalInfo && showInfo && (
        <p className={css.additionalInfo}>
          Пароль має складатись з мін. 8 та макс. 128 символів, цифр і
          спеціальних знаків
        </p>
      )}
    </>
  );
}
