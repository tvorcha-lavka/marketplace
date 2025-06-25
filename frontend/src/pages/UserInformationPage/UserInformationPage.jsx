import { Formik, Form } from 'formik';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LuTrash } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import FormField from '../../components/FormElements/FormField/FormField';
import CustomButton from '../../components/ButtonElements/CustomButton/CustomButton';
import CardNumberField from '../../components/FormElements/CardNumberField/CardNumberField';
import EmailField from '../../components/FormElements/EmailField/EmailField';
import PasswordField from '../../components/FormElements/PasswordField/PasswordField';
import CustomEditButton from '../../components/ButtonElements/CustomEditButton/CustomEditButton';

import { personalSchema, securitySchema } from '../../utils/formSchema';
import { media } from '../../utils/mediaConfig';
import {
  selectSelectedUser,
  selectEditingPersonal,
  selectEditingSecurity,
} from '../../redux/users/selectors';
import {
  updateUser,
  updateUserSecurity,
  fetchUserById,
  deleteUser,
} from '../../redux/users/operations';
import {
  setSelectedUser,
  setIsEditingPersonal,
  setIsEditingSecurity,
} from '../../redux/users/slice';

import css from './UserInformationPage.module.css';

export default function UserInformationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedUser = useSelector(selectSelectedUser);
  const isEditingPersonal = useSelector(selectEditingPersonal);
  const isEditingSecurity = useSelector(selectEditingSecurity);

  const user_id = localStorage.getItem('userId');

  const handlePersonalSubmit = (values) => {
    const userData = {
      username: values.username,
      first_name: values.name,
      last_name: values.surname,
      email: values.email,
      city: values.city,
    };

    if (selectedUser?.id) {
      dispatch(updateUser({ id: selectedUser.id, userData }))
        .unwrap()
        .then((updated) => {
          dispatch(setSelectedUser(updated));
          dispatch(setIsEditingPersonal(false));
        })
        .catch((error) => {
          console.error('Error updating personal info:', error);
        });
    }
  };

  const handleSecuritySubmit = (values) => {
    dispatch(
      updateUserSecurity({
        ...selectedUser,
        id: selectedUser.id,
        phone: values.phone,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
    )
      .unwrap()
      .then(() => {})
      .catch((error) => {
        console.error('Error updating security:', error);
      });
  };

  useEffect(() => {
    dispatch(fetchUserById(user_id)).then(() => {});
    dispatch(setIsEditingPersonal(false));
    dispatch(setIsEditingSecurity(false));
  }, [dispatch, user_id]);

  const handleDeleteProfile = () => {
    if (window.confirm('Ви точно хочете видалити профіль?')) {
      dispatch(deleteUser(user_id));
      navigate('/');
    }
  };

  return (
    <div className={css.container}>
      {/* ========== AVATAR FIELD ========== */}
      <div className={css.formContainer}>
        <div className={css.avatarWrapper}>
          {/* {avatar ? (
            <img
              className={css.avatarImage}
              src={user.avatar}
              alt="Avatar"
            /> 
          ) : (*/}
          <img
            src={`${media}/profile/avatar.png`}
            alt="Avatar"
            className={css.avatarImage}
          />
          {/* )} */}

          <input
            type="image"
            id="avatar"
            accept="image/*"
            className={css.avatarInput}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
            }}
          />

          <CustomEditButton
            onClick={() => document.getElementById('avatarInput')?.click()}
          >
            Змінити фото
          </CustomEditButton>
        </div>
        {/* ========== PERSONAL DATA ========== */}
        <div>
          <Formik
            initialValues={{
              username: selectedUser?.username || '',
              name: selectedUser?.first_name || '',
              surname: selectedUser?.last_name || '',
              email: selectedUser?.email || '',
              city: selectedUser?.city || '',
              //avatar: [],
            }}
            validationSchema={personalSchema}
            onSubmit={handlePersonalSubmit}
            enableReinitialize
          >
            {({ touched, errors, values, isValid, dirty }) => (
              <Form>
                <div className={css.wrap}>
                  <div className={css.headerWithButton}>
                    <h2 className={css.title}>Персональні дані</h2>
                    {!isEditingPersonal && (
                      <CustomEditButton
                        onClick={() => dispatch(setIsEditingPersonal(true))}
                      >
                        Редагувати
                      </CustomEditButton>
                    )}
                  </div>

                  {/* --- FIELDS (USERNSME, FIRSTNAME, LASTNAME, EMAIL, CITY) --- */}
                  <div className={css.fieldsWrap}>
                    <FormField
                      id="username"
                      name="username"
                      label="Назва користувача"
                      placeholder="Valeriia_fantasyseller12"
                      touched={touched}
                      errors={errors}
                      values={values}
                      inputWidth="874px"
                      disabled={!isEditingPersonal}
                    />
                  </div>

                  <div className={css.fieldsWrap}>
                    <FormField
                      id="name"
                      name="name"
                      label="Імʼя"
                      placeholder="Валерія"
                      touched={touched}
                      errors={errors}
                      values={values}
                      inputWidth="429px"
                      disabled={!isEditingPersonal}
                    />
                    <FormField
                      id="surname"
                      name="surname"
                      label="Прізвище"
                      placeholder="Шевченко"
                      touched={touched}
                      errors={errors}
                      values={values}
                      inputWidth="429px"
                      disabled={!isEditingPersonal}
                    />
                  </div>

                  <div className={css.fieldsWrap}>
                    <EmailField
                      id="email"
                      label="E-mail адреса"
                      touched={touched}
                      errors={errors}
                      values={values}
                      inputWidth="429px"
                      disabled={!isEditingPersonal}
                    />
                    <FormField
                      id="city"
                      name="city"
                      label="Місто"
                      placeholder="Київ"
                      touched={touched}
                      errors={errors}
                      values={values}
                      inputWidth="429px"
                      disabled={!isEditingPersonal}
                    />
                  </div>

                  {isEditingPersonal && (
                    <div className={css.btnWrap}>
                      <CustomButton
                        type="submit"
                        size="small"
                        variant="default"
                        className={css.saveBtn}
                        disabled={!isValid || !dirty}
                      >
                        Зберегти
                      </CustomButton>
                    </div>
                  )}

                  <span className={css.borderStyle}></span>
                </div>
              </Form>
            )}
          </Formik>

          {/* ========== SECURITY DATA ========== */}
          <Formik
            initialValues={{
              phone: selectedUser?.phone_number || '',
              oldPassword: '',
              newPassword: '',
              //avatar: [],
            }}
            validationSchema={securitySchema}
            onSubmit={handleSecuritySubmit}
            enableReinitialize
          >
            {({ setFieldValue, touched, errors, values, isValid, dirty }) => (
              <Form>
                <div className={css.wrap}>
                  <div className={css.headerWithButton}>
                    <h2 className={css.title}>Безпека даних</h2>
                    {!isEditingSecurity && (
                      <CustomEditButton
                        onClick={() => dispatch(setIsEditingSecurity(true))}
                      >
                        Редагувати
                      </CustomEditButton>
                    )}
                  </div>

                  {/* --- FIELDS (PHONE, OLD/NEW PASSWORD) --- */}
                  <div className={css.fieldsWrap}>
                    <CardNumberField
                      id="phone"
                      name="phone"
                      type="text"
                      label="Телефон"
                      placeholder="+38 (067) 112-45-45"
                      touched={touched}
                      errors={errors}
                      values={values}
                      inputWidth="429px"
                      disabled={!isEditingSecurity}
                    />
                    <PasswordField
                      id="oldPassword"
                      name="oldPassword"
                      label="Старий пароль"
                      placeholder="Password"
                      touched={touched}
                      errors={errors}
                      values={values}
                      inputWidth="429px"
                      disabled={!isEditingSecurity}
                      setFieldValue={setFieldValue}
                      showStrengthLabel={false}
                      showAdditionalInfo={false}
                    />
                  </div>

                  <div className={css.newPwdWrap}>
                    <PasswordField
                      id="newPassword"
                      name="newPassword"
                      label="Новий пароль"
                      placeholder="Password"
                      touched={touched}
                      errors={errors}
                      values={values}
                      inputWidth="429px"
                      disabled={!isEditingSecurity}
                      setFieldValue={setFieldValue}
                      showStrengthLabel={false}
                      showAdditionalInfo={false}
                    />
                  </div>

                  {isEditingSecurity && (
                    <div className={css.btnWrap}>
                      <CustomButton
                        type="submit"
                        size="small"
                        variant="default"
                        className={css.saveBtnSecurity}
                        disabled={!isValid || !dirty}
                      >
                        Зберегти
                      </CustomButton>
                    </div>
                  )}

                  <span className={css.borderSecurityStyle}></span>
                </div>
              </Form>
            )}
          </Formik>

          {/* ========== DELETE USER PROFILE ========== */}
          <h2 className={css.title}>Управління профілем</h2>
          <p className={css.noticeText}>
            Видаляючи профіль, ви назавжди втратите всі дані, пов&#8217;язані з
            вашим обліковим записом. Цю дію неможливо скасувати. Ви впевнені, що
            хочете продовжити?
          </p>
          <button
            type="button"
            className={css.removeBtn}
            onClick={handleDeleteProfile}
          >
            <LuTrash className={css.removeIcon} />
            Видалити профіль
          </button>
        </div>
      </div>
    </div>
  );
}
