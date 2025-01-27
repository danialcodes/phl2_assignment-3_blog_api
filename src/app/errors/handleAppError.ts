import { IErrorSources, IGenericErrorResponse } from '../interface/error';
import AppError from './AppError';

const handleAppError = (err: AppError): IGenericErrorResponse => {
    const errorSources: IErrorSources = [
        {
            path: '',
            message: err?.message,
        },
    ];
    return {
        statusCode: err?.statusCode,
        message: `${err.name} : ${err?.message}`,
        errorSources,
    };
};

export default handleAppError;
