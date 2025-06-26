import * as Yup from 'yup';

const phoneRegExp = /^\+38 \(0\d{2}\) \d{3}-\d{2}-\d{2}$/;
const usernameRegExp = /^[a-zA-Z0-9_.-]+$/;
const nameRegExp = /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ'-]+$/;

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

export const validationSchema = Yup.object({
  name: Yup.string()
    .matches(nameRegExp, 'Лише букви та дефіс')
    .required('Обовʼязкове поле'),
  surname: Yup.string()
    .matches(nameRegExp, 'Лише букви та дефіс')
    .required('Обовʼязкове поле'),
  phone: Yup.string()
    .matches(phoneRegExp, 'Невірний формат телефону')
    .required('Обовʼязкове поле'),
  email: Yup.string()
    .email('Невірний формат email')
    .max(320)
    .required('Обовʼязкове поле'),
});

export const personalSchema = Yup.object({
  username: Yup.string()
    .matches(usernameRegExp, 'Допустимі лише букви, цифри, _, -, .')
    .min(3)
    .max(30)
    .required('Обовʼязкове поле'),
  name: Yup.string()
    .matches(nameRegExp, 'Лише букви та дефіс')
    .min(2)
    .max(50)
    .required('Обовʼязкове поле'),
  surname: Yup.string()
    .matches(nameRegExp, 'Лише букви та дефіс')
    .min(2)
    .max(50)
    .required('Обовʼязкове поле'),
  email: Yup.string()
    .email('Невірний формат email')
    .max(320)
    .required('Обовʼязкове поле'),
  city: Yup.string().min(2).required('Обовʼязкове поле'),
});

export const securitySchema = Yup.object({
  phone: Yup.string()
    .matches(phoneRegExp, 'Невірний формат телефону')
    .required('Обовʼязкове поле'),
  oldPassword: Yup.string().min(8).max(128).required('Обовʼязкове поле'),
  newPassword: Yup.string().min(8).max(128).required('Обовʼязкове поле'),
});

export const cardSchema = Yup.object({
  card_number: Yup.string()
    .required('Обовʼязкове поле')
    .test(
      'len',
      'Номер карти має містити 16 цифр',
      (val) => val && val.replace(/\s/g, '').length === 16
    ),
  card_expire: Yup.string()
    .required('Обовʼязкове поле')
    .matches(
      /^(0[1-9]|1[0-2])\/20\d{2}$/,
      'Термін дії повинен бути у форматі MM/YYYY'
    )
    .test('notPastDate', 'Картка прострочена', function (value) {
      if (!value) return false;
      const [monthStr, yearStr] = value.split('/');
      if (!monthStr || !yearStr) return false;

      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      if (month < 1 || month > 12) return false;

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;

      return true;
    }),
  card_cvv: Yup.string()
    .required('Обовʼязкове поле')
    .matches(/^\d{3}$/, 'CVV має містити 3 цифри'),
  card_holder: Yup.string()
    .required('Обовʼязкове поле')
    .matches(
      /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ'’ -]+$/,
      'Лише літери, пробіли, дефіси та апострофи'
    ),
});
