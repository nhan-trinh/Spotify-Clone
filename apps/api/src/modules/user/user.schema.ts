import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    gender: z.enum(['man', 'woman', 'non-binary', 'prefer_not_to_say']).optional(),
    dateOfBirth: z.string().datetime().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(10)
      .regex(/[a-zA-Z]/)
      .regex(/[0-9!@#$%^&*?]/),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
