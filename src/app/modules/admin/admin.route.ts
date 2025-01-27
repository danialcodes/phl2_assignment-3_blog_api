import express from 'express';
import { AdminControllers } from './admin.controller';
import { USER_ROLE } from '../user/user.const';
import auth from '../../middlewares/auth';

const router = express.Router();

router.patch(
    '/users/:userId/block',
    auth(USER_ROLE.admin),
    AdminControllers.blockSingleUser,
);

router.delete(
    '/blogs/:id',
    auth(USER_ROLE.admin),
    AdminControllers.deleteSingleBlog,
);

export const AdminRoutes = router;
