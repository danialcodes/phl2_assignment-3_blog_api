import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser: RequestHandler = asyncHandler(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: config.node_env === 'production',
        httpOnly: true,
    });
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Login successful',
        data: {
            token: accessToken,
        },
    });
});

const registerUser: RequestHandler = asyncHandler(async (req, res) => {
    const result = await AuthServices.registerUser(req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'User registered successfully',
        data: result,
    });
});
const changePassword: RequestHandler = asyncHandler(async (req, res) => {
    const { email } = req.user;
    const result = await AuthServices.changePassword(email, req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Password changed successfully',
        data: result,
    });
});
const refreshToken: RequestHandler = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Access token refreshed',
        data: result,
    });
});

export const AuthControllers = {
    registerUser,
    loginUser,
    changePassword,
    refreshToken,
};
