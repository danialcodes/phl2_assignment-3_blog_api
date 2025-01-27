import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
import { USER_ROLE } from '../user/user.const';
import auth from '../../middlewares/auth';

const router = Router();

// anyone can register as a user
router.post(
    '/register',
    validateRequest(AuthValidations.registerValidationSchema),
    AuthControllers.registerUser,
);

// anyone can login
router.post(
    '/login',
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.loginUser,
);

// change password rotue is protected and only authenticated users can access it
// though it's not part of the requirements, but emplemented for demonstration
router.post(
    '/change-password',
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

// refresh token route is open to all
// though it's not part of the requirements, but emplemented for demonstration
router.post(
    '/refresh-token',
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

export const AuthRoutes = router;
