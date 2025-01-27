import { IErrorSources, IGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): IGenericErrorResponse => {
    const statusCode = 400;

    const match = err.message.match(/"([^"]*)"/);
    const extractedMsg = match ? match[1] : null;
    const errorSources: IErrorSources = [
        {
            path: '',
            message: `${extractedMsg} already exists`,
        },
    ];
    return {
        statusCode,
        message: 'Duplicate Value Error',
        errorSources,
    };
};

export default handleDuplicateError;
