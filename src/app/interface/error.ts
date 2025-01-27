export type IErrorSources = {
    path: string | number;
    message: string;
}[];

export interface ISimplifiedError {
    statusCode?: number;
    message?: string;
    errorSources?: IErrorSources;
}

export type IGenericErrorResponse = Required<ISimplifiedError>;
