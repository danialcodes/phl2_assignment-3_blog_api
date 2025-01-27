import { BlogValidations } from './blog.validation';
import express from 'express';
import { BlogControllers } from './blog.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router = express.Router();

router.get('/', BlogControllers.getAllBlogs);
router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(BlogValidations.createBlogValidationSchema),
    BlogControllers.createBlog,
);
router.delete(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.user),
    BlogControllers.deleteSingleBlog,
);
router.patch(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(BlogValidations.updateBlogValidationSchema),
    BlogControllers.updateSingleBlog,
);
export const BlogRoutes = router;
