"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const user_const_1 = require("../user/user.const");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
// anyone can register as a user
router.post('/register', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.registerValidationSchema), auth_controller_1.AuthControllers.registerUser);
// anyone can login
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginValidationSchema), auth_controller_1.AuthControllers.loginUser);
// change password rotue is protected and only authenticated users can access it
// though it's not part of the requirements, but emplemented for demonstration
router.post('/change-password', (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.user), (0, validateRequest_1.default)(auth_validation_1.AuthValidations.changePasswordValidationSchema), auth_controller_1.AuthControllers.changePassword);
// refresh token route is open to all
// though it's not part of the requirements, but emplemented for demonstration
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshToken);
exports.AuthRoutes = router;
