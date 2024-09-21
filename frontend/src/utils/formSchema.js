import * as Yup from 'yup';

export const passwordSchema = Yup.object({
  password: Yup.string().min(8).max(30).required(),
});

export const codeSchema = Yup.object({
  code: Yup.array()
    .of(Yup.string().matches(/^\d$/).required())
    .min(6)
    .required(),
});

export const forgotPasswordSchema = Yup.object({
  emailOrPhone: Yup.string()
    .required()
    .test(function (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const uaPhoneRegex = /^\+380[0-9]{9}$/;
      const plPhoneRegex = /^\+48[0-9]{9}$/;
      const dePhoneRegex = /^\+49[1-9][0-9]{1,14}$/;
      const nlPhoneRegex = /^\+31[0-9]{9}$/;
      const gbPhoneRegex = /^\+44[1-9][0-9]{9,10}$/;

      return (
        emailRegex.test(value) ||
        uaPhoneRegex.test(value) ||
        plPhoneRegex.test(value) ||
        dePhoneRegex.test(value) ||
        nlPhoneRegex.test(value) ||
        gbPhoneRegex.test(value)
      );
    }),
});

export const schema = Yup.object({
  emailOrPhone: Yup.string()
    .required()
    .test(function (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const uaPhoneRegex = /^\+380[0-9]{9}$/;
      const plPhoneRegex = /^\+48[0-9]{9}$/;
      const dePhoneRegex = /^\+49[1-9][0-9]{1,14}$/;
      const nlPhoneRegex = /^\+31[0-9]{9}$/;
      const gbPhoneRegex = /^\+44[1-9][0-9]{9,10}$/;

      return (
        emailRegex.test(value) ||
        uaPhoneRegex.test(value) ||
        plPhoneRegex.test(value) ||
        dePhoneRegex.test(value) ||
        nlPhoneRegex.test(value) ||
        gbPhoneRegex.test(value)
      );
    }),
  password: Yup.string().min(8).max(30).required(),
  userRemember: Yup.boolean(),
});
