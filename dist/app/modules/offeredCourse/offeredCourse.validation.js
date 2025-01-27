"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseValidations = void 0;
const zod_1 = require("zod");
const offeredCourse_const_1 = require("./offeredCourse.const");
const timeFormatSchema = zod_1.z.string().refine(time => {
    // HH:MM format string
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}, { message: "Invalid time format: expected HH:MM" });
const createOfferedCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        semesterRegistration: zod_1.z.string(),
        academicDepartment: zod_1.z.string(),
        academicFaculty: zod_1.z.string(),
        course: zod_1.z.string(),
        faculty: zod_1.z.string(),
        maxCapacity: zod_1.z.number(),
        section: zod_1.z.number(),
        days: zod_1.z.array(zod_1.z.enum([...offeredCourse_const_1.Days])),
        startTime: timeFormatSchema,
        endTime: timeFormatSchema,
    }).refine(({ startTime, endTime }) => {
        const start = new Date(`2025-01-01T${startTime}:00`);
        const end = new Date(`2025-01-01T${endTime}:00`);
        return start < end;
    }, { message: "Invalid time range: start time should be less than end time" })
});
const updateOfferedCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        faculty: zod_1.z.string(),
        maxCapacity: zod_1.z.number().optional(),
        section: zod_1.z.number(),
        days: zod_1.z.array(zod_1.z.enum([...offeredCourse_const_1.Days])),
        startTime: timeFormatSchema,
        endTime: timeFormatSchema,
    }).refine(({ startTime, endTime }) => {
        const start = new Date(`2025-01-01T${startTime}:00`);
        const end = new Date(`2025-01-01T${endTime}:00`);
        return start < end;
    }, { message: "Invalid time range: start time should be less than end time" })
});
exports.OfferedCourseValidations = {
    createOfferedCourseValidationSchema,
    updateOfferedCourseValidationSchema
};
