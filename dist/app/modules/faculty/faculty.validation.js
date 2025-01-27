"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyValidations = void 0;
const user_validation_1 = require("./../user/user.validation");
const zod_1 = require("zod");
const createFacultyValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().max(20, { message: "Password must be within 20 characters" }),
        faculty: zod_1.z.object({
            designation: zod_1.z.string(),
            name: user_validation_1.UserValidations.createUserNameValidationSchema,
            gender: zod_1.z.enum(['male', 'female', 'other']),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().email(),
            contractNo: zod_1.z.string(),
            emergencyContactNo: zod_1.z.string(),
            bloodGroup: zod_1.z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            presentAddress: zod_1.z.string(),
            permanentAddress: zod_1.z.string(),
            profileImage: zod_1.z.string().url().optional(),
            academicDepartment: zod_1.z.string(),
        })
    })
});
const updateFacultyValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        faculty: zod_1.z.object({
            name: user_validation_1.UserValidations.updateUserNameValidationSchema.optional(),
            gender: zod_1.z.enum(['male', 'female', 'other']).optional(),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            contactNo: zod_1.z.string().optional(),
            emergencyContactNo: zod_1.z.string().optional(),
            bloogGroup: zod_1.z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            presentAddress: zod_1.z.string().optional(),
            permanentAddress: zod_1.z.string().optional(),
            profileImg: zod_1.z.string().optional(),
            academicDepartment: zod_1.z.string().optional(),
        }),
    }),
});
exports.FacultyValidations = {
    createFacultyValidationSchema,
    updateFacultyValidationSchema,
};
