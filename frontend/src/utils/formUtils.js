export const handleSupportClick = (closeModal, navigate) => {
  closeModal();

  setTimeout(() => {
    navigate('/support');
  }, 0);
};

export const handleBack = (type, openModal) => {
  openModal(type === 'verification-register' ? 'register' : 'forgot-password');
};

// Confirmation modal
export const getTitleConfirmation = (type) => {
  return type === 'verification-register'
    ? 'Реєстрацію завершено'
    : 'Ваш пароль змінено';
};

// Confirmation modal
export const getDescriptionConfirmation = (type) => {
  return type === 'verification-register'
    ? 'Тепер ви можете зайти на cвій акаунт використовуючи свої дані для входу'
    : 'Тепер ви можете зайти на cвій акаунт використовуючи новий пароль';
};

// Verification modal
export const getDescription = (type) => {
  return type === 'verification-register'
    ? 'На вашу електронну пошту надіслано код підтвердження. Введіть його нижче, щоб завершити реєстрацію'
    : 'Введіть унікальний 6-значний код, який був висланий на ваш e-mail';
};
