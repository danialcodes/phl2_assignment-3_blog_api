import { IErrorSources, ISimplifiedError } from '../interface/error';

const handleError = (err: Error): ISimplifiedError => {
    const errorSources: IErrorSources = [
        {
            path: '',
            message: err?.message,
        },
    ];
    return {
        message: err?.message,
        errorSources,
    };
};

export default handleError;
