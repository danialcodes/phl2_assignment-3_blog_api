import mongoose from 'mongoose';
import { IErrorSources, IGenericErrorResponse } from '../interface/error';

const handleValidationError = (
    err: mongoose.Error.ValidationError,
): IGenericErrorResponse => {
    const statusCode = 400;
    const errorSources: IErrorSources = Object.values(err.errors).map(
        (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: val?.path,
                message: val?.message,
            };
        },
    );

    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};

export default handleValidationError;
