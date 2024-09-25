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
  email: Yup.string().email().required(),
});

export const schema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).max(30).required(),
});


