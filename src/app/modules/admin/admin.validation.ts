import { z } from 'zod';

const createAdminValidationSchema = z.object({
    body: z.object({}),
});

const updateAdminValidationSchema = z.object({
    body: z.object({}),
});

export const AdminValidations = {
    createAdminValidationSchema,
    updateAdminValidationSchema,
};
