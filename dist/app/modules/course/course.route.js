"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const course_validation_1 = require("./course.validation");
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.faculty, user_const_1.USER_ROLE.student), course_controller_1.CourseControllers.getAllCourses);
router.post("/", (0, auth_1.default)(user_const_1.USER_ROLE.admin), course_controller_1.CourseControllers.createCourse);
router.get("/:id", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.faculty, user_const_1.USER_ROLE.student), course_controller_1.CourseControllers.getSingleCourse);
router.patch("/:id", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(course_validation_1.CourseValidations.updateCourseValidationSchema), course_controller_1.CourseControllers.updateSingleCourse);
router.delete("/:id", (0, auth_1.default)(user_const_1.USER_ROLE.admin), course_controller_1.CourseControllers.deleteSingleCourse);
router.put("/:id/assign-faculties", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(course_validation_1.CourseValidations.facultiesWithCourseValidationSchema), course_controller_1.CourseControllers.assignFacultiesToCourse);
router.delete("/:id/remove-faculties", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(course_validation_1.CourseValidations.facultiesWithCourseValidationSchema), course_controller_1.CourseControllers.removeFacultiesFromCourse);
exports.CourseRoutes = router;
