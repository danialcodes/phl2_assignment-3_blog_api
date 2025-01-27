import { z } from 'zod';

const registerValidationSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, 'Minimum lenght should be 1')
            .max(20, 'Name must be within 20 characters'),
        email: z.string().email('Invalid email format'),
        password: z
            .string({
                invalid_type_error: 'Password must be a string',
            })
            .max(20, { message: 'Password must be within 20 characters' }),
    }),
});

const loginValidationSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required for login' })
            .email('Invalid email format'),
        password: z.string({ required_error: 'Password is required' }),
    }),
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old Password is required' }),
        newPassword: z.string({ required_error: 'New Password is required' }),
    }),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({ required_error: 'Refresh token is required' }),
    }),
});

export const AuthValidations = {
    registerValidationSchema,
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
};
