import { GenderEnum, ProviderEnum } from 'src/DB/ennums/user.enum';
import z from 'zod';
export type ISsignupDto = z.infer<typeof signupSchema>;
export type IRsendOtpDto = z.infer<typeof resendOtpSchema>;
export type IConfirmEmailDto = z.infer<typeof confirmEmail>;
export type ILoginDto = z.infer<typeof login>;
export let signupSchema = z
  .strictObject({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email({ message: 'Invalid Email Address' }),
    password: z.string(),
    confirmPassword: z.string(),
    gender: z.enum(GenderEnum).optional(),
    provider: z.enum(ProviderEnum).optional(),
  })
  .superRefine(function (data, ctx) {
    if (data.password != data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'password missmatch',
        path: ['confirmPassword'],
      });
    }
  });

export let resendOtpSchema = z.strictObject({
  email: z.email({ message: 'Invalid Email Address' }),
});

export let confirmEmail = z.strictObject({
  email: z.email({ message: 'Invalid Email Address' }),
  otp: z.string(),
});

export let login = z.strictObject({
  email: z.email({ message: 'Invalid Email Address' }),
  password: z.string(),
});
