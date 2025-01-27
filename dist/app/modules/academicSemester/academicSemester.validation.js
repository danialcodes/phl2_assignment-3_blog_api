"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterValidations = void 0;
const zod_1 = require("zod");
const academicSemester_const_1 = require("./academicSemester.const");
const createAcademicSemesterValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.enum(academicSemester_const_1.AcademicSemesterName),
        code: zod_1.z.enum(academicSemester_const_1.AcademicSemesterCode),
        year: zod_1.z.string(),
        startMonth: zod_1.z.enum(academicSemester_const_1.AcademicSemesterMonths),
        endMonth: zod_1.z.enum(academicSemester_const_1.AcademicSemesterMonths),
    })
});
const updateAcademicSemesterValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.enum(academicSemester_const_1.AcademicSemesterName).optional(),
        year: zod_1.z.string().optional(),
        code: zod_1.z.enum(academicSemester_const_1.AcademicSemesterCode).optional(),
        startMonth: zod_1.z.enum(academicSemester_const_1.AcademicSemesterMonths).optional(),
        endMonth: zod_1.z.enum(academicSemester_const_1.AcademicSemesterMonths).optional(),
    }),
});
exports.AcademicSemesterValidations = {
    createAcademicSemesterValidationSchema,
    updateAcademicSemesterValidationSchema
};
