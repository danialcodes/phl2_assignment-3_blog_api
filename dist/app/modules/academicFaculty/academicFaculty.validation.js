"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFacultyValidations = void 0;
const zod_1 = require("zod");
const createAcademicFacultyValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
    })
});
const updateAcademicFacultyValidationSchema = createAcademicFacultyValidationSchema;
exports.AcademicFacultyValidations = {
    createAcademicFacultyValidationSchema,
    updateAcademicFacultyValidationSchema
};
