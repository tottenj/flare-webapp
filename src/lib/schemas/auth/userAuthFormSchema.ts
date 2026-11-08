import z from 'zod';

export const createUserAuthFormSchema = (isSignup: boolean) =>
  z
    .object({
      email: z.string().email('Enter a valid email address.'),
      password: z.string().min(1, 'Enter your password.'),
      confirmPassword: z.string().optional(),
    })
    .superRefine((values, context) => {
      if (!isSignup) return;

      if (values.password.length < 6) {
        context.addIssue({
          code: 'custom',
          path: ['password'],
          message: 'Password must be at least 6 characters.',
        });
      }

      if (!values.confirmPassword) {
        context.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: 'Please confirm your password.',
        });
      } else if (values.password !== values.confirmPassword) {
        context.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: 'Passwords do not match.',
        });
      }
    });

export type UserAuthFormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};
