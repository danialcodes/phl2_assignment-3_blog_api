"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFacultyRoutes = void 0;
const express_1 = require("express");
const academicFaculty_controller_1 = require("./academicFaculty.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicFaculty_validation_1 = require("./academicFaculty.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(academicFaculty_validation_1.AcademicFacultyValidations.createAcademicFacultyValidationSchema), academicFaculty_controller_1.AcademicFacultyControllers.createAcademicFaculty);
router.get("/", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.faculty, user_const_1.USER_ROLE.student), academicFaculty_controller_1.AcademicFacultyControllers.getAllAcademicFaculties);
router.get("/:facultyId", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.faculty, user_const_1.USER_ROLE.student), academicFaculty_controller_1.AcademicFacultyControllers.getSingleAcademicFaculty);
router.patch("/:facultyId", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(academicFaculty_validation_1.AcademicFacultyValidations.updateAcademicFacultyValidationSchema), academicFaculty_controller_1.AcademicFacultyControllers.updateSingleAcademicFaculty);
exports.AcademicFacultyRoutes = router;
