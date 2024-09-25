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


