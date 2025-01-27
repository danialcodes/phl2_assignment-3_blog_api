import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ILoginUser } from './auth.interface';
import { User } from '../user/user.model';

import config from '../../config';
import { generateToken } from './auth.utils';
import { IUser } from '../user/user.interface';
import { ERROR_TYPE } from '../../errors/error.const';

const registerUser = async (
    payload: Pick<IUser, 'name' | 'email' | 'password'>,
) => {
    const { name, email, password } = payload;

    const isUserExists = await User.isExistsByEmail(email);
    if (isUserExists) {
        throw new AppError(
            StatusCodes.CONFLICT,
            'User already exists',
            ERROR_TYPE.CONFLICT_ERROR,
        );
    }
    const userData = {
        name,
        email,
        password,
    };

    const newUser = await User.create(userData);
    if (!newUser) {
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'User creation failed',
            ERROR_TYPE.INTERNAL_SERVER_ERROR,
        );
    }
    return {
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
    };
};

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;
    const isUserExists = await User.isExistsByEmail(email);

    if (
        !isUserExists ||
        isUserExists.isBlocked ||
        !(await User.isPasswordMatched(password, isUserExists.password))
    ) {
        throw new AppError(
            StatusCodes.UNAUTHORIZED,
            'Invalid credentials',
            ERROR_TYPE.AUTHORIZATION_ERROR,
        );
    }

    // jwt token
    const jwtPayload = {
        email: isUserExists.email,
        role: isUserExists.role,
    };
    const accessToken = generateToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in,
    );
    const refreshToken = generateToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in,
    );

    return {
        accessToken,
        refreshToken,
    };
};

const changePassword = async (
    email: string,
    payload: { oldPassword: string; newPassword: string },
) => {
    const isUserExists = await User.isExistsByEmail(email);
    if (!isUserExists) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'User not found',
            ERROR_TYPE.AUTHORIZATION_ERROR,
        );
    }
    if (isUserExists.isBlocked) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            'The user is blocked',
            ERROR_TYPE.AUTHORIZATION_ERROR,
        );
    }

    // password checking
    if (
        !(await User.isPasswordMatched(
            payload.oldPassword,
            isUserExists.password,
        ))
    ) {
        throw new AppError(
            StatusCodes.UNAUTHORIZED,
            'Invalid password',
            ERROR_TYPE.AUTHORIZATION_ERROR,
        );
    }

    // password update
    await User.findOneAndUpdate(
        { email },
        {
            password: await User.hashThePassword(payload.newPassword),
            needsPasswordChange: false,
            passwordChangeAt: new Date(),
        },
    );
    return null;
};

const refreshToken = async (token: string) => {
    // verify token

    const user = jwt.verify(
        token,
        config.jwt_refresh_secret as string,
    ) as JwtPayload;

    const { email, iat } = user;

    const isUserExists = await User.isExistsByEmail(email);

    if (!isUserExists) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'User not found',
            ERROR_TYPE.AUTHORIZATION_ERROR,
        );
    }
    if (isUserExists.isBlocked) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            'The user is blocked',
            ERROR_TYPE.AUTHORIZATION_ERROR,
        );
    }

    const passwordChangeAt = isUserExists.passwordChangeAt;
    if (passwordChangeAt) {
        if (User.isJWTExpired(iat as number, passwordChangeAt)) {
            throw new AppError(
                StatusCodes.UNAUTHORIZED,
                'Expired Token',
                ERROR_TYPE.AUTH_ERROR,
            );
        }
    }

    // jwt token refresh
    const jwtPayload = {
        email: isUserExists.email,
        role: isUserExists.role,
    };
    const accessToken = generateToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in,
    );
    return {
        accessToken,
    };
};

export const AuthServices = {
    registerUser,
    loginUser,
    changePassword,
    refreshToken,
};
