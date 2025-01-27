"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidations = void 0;
const zod_1 = require("zod");
const createAdminValidationSchema = zod_1.z.object({
    body: zod_1.z.object({}),
});
const updateAdminValidationSchema = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.AdminValidations = {
    createAdminValidationSchema,
    updateAdminValidationSchema,
};
