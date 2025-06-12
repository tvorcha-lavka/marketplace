import * as Yup from 'yup';

export const passwordSchema = Yup.object({
  password: Yup.string().min(8).max(128).required(),
});

export const codeSchema = Yup.object({
  code: Yup.array()
    .of(Yup.string().matches(/^\d$/).required())
    .min(6)
    .max(6)
    .required(),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string().email().max(320).required(),
});

export const schema = Yup.object({
  email: Yup.string().email().max(320).required(),
  password: Yup.string().min(8).max(128).required(),
});

const phoneRegExp = /^\+38 \(0\d{2}\) \d{3}-\d{2}-\d{2}$/;

export const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Zа-яА-ЯіїєґІЇЄҐ-]+$/, 'Лише букви та дефіс')
    .required('Обовʼязкове поле'),
  surname: Yup.string()
    .matches(/^[a-zA-Zа-яА-ЯіїєґІЇЄҐ-]+$/, 'Лише букви та дефіс')
    .required('Обовʼязкове поле'),
  phone: Yup.string()
    .matches(phoneRegExp, 'Невірний формат телефону')
    .required('Обовʼязкове поле'),
  email: Yup.string()
    .email('Невірний формат email')
    .required('Обовʼязкове поле'),
});
