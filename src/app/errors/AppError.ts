class AppError extends Error {
    public statusCode: number;
    constructor(
        statusCode: number,
        message: string,
        name?: string,
        stack = '',
    ) {
        super(message);
        this.statusCode = statusCode;
        this.name = name || 'AppError';
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError;
