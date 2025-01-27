/* eslint-disable no-unused-vars */

import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import { IErrorSources, ISimplifiedError } from '../interface/error';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';
import handleAppError from '../errors/handleAppError';
import handleError from '../errors/handleError';

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    let simplifiedError: ISimplifiedError = {};
    // if error is instance of ZodError
    if (error instanceof ZodError) {
        simplifiedError = handleZodError(error);
    } else if (error?.name === 'ValidationError') {
        simplifiedError = handleValidationError(error);
    } else if (error?.name === 'CastError') {
        simplifiedError = handleCastError(error);
    } else if (error?.code === 11000) {
        simplifiedError = handleDuplicateError(error);
    } else if (error instanceof AppError) {
        simplifiedError = handleAppError(error);
    } else if (error instanceof Error) {
        simplifiedError = handleError(error);
    }

    // default values
    const statusCode = simplifiedError.statusCode || error.statusCode || 500;
    const message =
        simplifiedError.message || error.message || 'Something went wrong';
    const errorSources = {
        details: simplifiedError.errorSources || [
            {
                path: '',
                message: 'Something went wrong',
            },
        ],
    };

    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        error: errorSources,
        stack: config.node_env === 'development' ? error.stack : null,
    });
};

export default errorHandler;
