import mongoose from 'mongoose';
import { IErrorSources, IGenericErrorResponse } from '../interface/error';

const handleCastError = (
    err: mongoose.Error.CastError,
): IGenericErrorResponse => {
    const statusCode = 400;
    const errorSources: IErrorSources = [
        {
            path: err?.path,
            message: err?.message,
        },
    ];

    return {
        statusCode,
        message: 'Invalid Id',
        errorSources,
    };
};

export default handleCastError;
