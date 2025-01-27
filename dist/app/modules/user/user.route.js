"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const student_validation_1 = require("./../student/student.validation");
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faculty_validation_1 = require("../faculty/faculty.validation");
const admin_validation_1 = require("../admin/admin.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("./user.const");
const router = express_1.default.Router();
router.post("/create-student", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(student_validation_1.StudentValidations.createStudentValidationSchema), user_controller_1.UserControllers.createStudent);
router.post("/create-faculty", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(faculty_validation_1.FacultyValidations.createFacultyValidationSchema), user_controller_1.UserControllers.createFaculty);
router.post("/create-admin", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(admin_validation_1.AdminValidations.createAdminValidationSchema), user_controller_1.UserControllers.createAdmin);
exports.UserRoutes = router;
