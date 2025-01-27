"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseRoutes = void 0;
const express_1 = require("express");
const offeredCourse_controller_1 = require("./offeredCourse.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const offeredCourse_validation_1 = require("./offeredCourse.validation");
const user_const_1 = require("../user/user.const");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(offeredCourse_validation_1.OfferedCourseValidations.createOfferedCourseValidationSchema), offeredCourse_controller_1.OfferedCourseControllers.createOfferedCourse);
router.get("/", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.faculty, user_const_1.USER_ROLE.student), offeredCourse_controller_1.OfferedCourseControllers.getOfferedCourse);
router.get("/:id", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.faculty, user_const_1.USER_ROLE.student), offeredCourse_controller_1.OfferedCourseControllers.getSingleOfferedCourse);
router.patch("/:id", (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(offeredCourse_validation_1.OfferedCourseValidations.updateOfferedCourseValidationSchema), offeredCourse_controller_1.OfferedCourseControllers.updateSingleOfferedCourse);
router.delete("/:id", (0, auth_1.default)(user_const_1.USER_ROLE.admin), offeredCourse_controller_1.OfferedCourseControllers.deleteSingleOfferedCourse);
exports.OfferedCourseRoutes = router;
