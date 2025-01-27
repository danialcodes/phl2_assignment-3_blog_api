"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err) => {
    const statusCode = 400;
    const match = err.message.match(/"([^"]*)"/);
    const extractedMsg = match ? match[1] : null;
    const errorSources = [
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
exports.default = handleDuplicateError;
