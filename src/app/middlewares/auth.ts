import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import { IUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import { ERROR_TYPE } from '../errors/error.const';

const auth = (...requiredRoles: IUserRole[]) => {
    return asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.header('Authorization')?.split(' ')[1];
            if (!token) {
                throw new AppError(
                    StatusCodes.UNAUTHORIZED,
                    'You are not authorized',
                    ERROR_TYPE.AUTH_ERROR,
                );
            }

            // verify token

            const user = jwt.verify(
                token,
                config.jwt_access_secret as string,
            ) as JwtPayload;

            const { role, email, iat } = user;

            const isUserExists = await User.isExistsByEmail(email);

            if (!isUserExists || isUserExists.isBlocked) {
                throw new AppError(
                    StatusCodes.UNAUTHORIZED,
                    'Unauthorized access token',
                    ERROR_TYPE.AUTHORIZATION_ERROR,
                );
            }

            const passwordChangeAt = isUserExists.passwordChangeAt;
            if (passwordChangeAt) {
                if (User.isJWTExpired(iat as number, passwordChangeAt)) {
                    throw new AppError(
                        StatusCodes.FORBIDDEN,
                        'Expired access token',
                        ERROR_TYPE.AUTH_ERROR,
                    );
                }
            }

            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError(
                    StatusCodes.UNAUTHORIZED,
                    'Unauthorized access token',
                    ERROR_TYPE.AUTHORIZATION_ERROR,
                );
            }
            req.user = user as JwtPayload;
            next();
        },
    );
};

export default auth;
