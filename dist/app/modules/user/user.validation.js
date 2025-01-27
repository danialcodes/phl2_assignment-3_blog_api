"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const createUserNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(1)
        .max(20)
        .refine((value) => {
        const firstLetter = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return value === firstLetter;
    }, { message: "First name must be capitalized." }),
    middleName: zod_1.z.string().optional(),
    lastName: zod_1.z.string(),
});
const updateUserNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(20).refine((value) => {
        const firstLetter = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return value === firstLetter;
    }, { message: "First name must be capitalized." }).optional(),
    middleName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
});
const userValidationSchema = zod_1.z.object({
    password: zod_1.z.string({
        invalid_type_error: "Password must be a string",
    }).max(20, { message: "Password must be within 20 characters" }).optional(),
});
exports.UserValidations = {
    userValidationSchema,
    createUserNameValidationSchema,
    updateUserNameValidationSchema,
};
