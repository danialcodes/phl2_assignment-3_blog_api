"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationRoutes = void 0;
const express_1 = require("express");
const semesterRegistration_controller_1 = require("./semesterRegistration.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const semesterRegistration_validation_1 = require("./semesterRegistration.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidations.createSemesterRegistrationValidationSchema), semesterRegistration_controller_1.SemesterRegistrationControllers.createSemesterRegistration);
router.get("/", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.faculty, user_const_1.USER_ROLE.student), semesterRegistration_controller_1.SemesterRegistrationControllers.getSemesterRegistration);
router.get("/:semesterId", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.faculty, user_const_1.USER_ROLE.student), semesterRegistration_controller_1.SemesterRegistrationControllers.getSingleSemesterRegistration);
router.patch("/:semesterId", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema), semesterRegistration_controller_1.SemesterRegistrationControllers.updateSingleSemesterRegistration);
router.delete("/:semesterId", (0, auth_1.default)(user_const_1.USER_ROLE.admin), semesterRegistration_controller_1.SemesterRegistrationControllers.deleteSingleSemesterRegistration);
exports.SemesterRegistrationRoutes = router;
