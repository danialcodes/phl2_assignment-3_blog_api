import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import errorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// default route
app.get('/', (req: Request, res: Response) => {
    res.send(
        `<html>
            <head>
                <title>Blog API</title>
            </head>
            <body style='width:100vw;display:flex;justify-content:center;align-items:center'>
                <h1 style='color:green'>Welcome to Blog Api</h1>
            </body>
        </html>
        `,
    );
});

// application routes
app.use(
    '/api',
    (_req: Request, res: Response, next: NextFunction) => {
        // console.log('----------');

        next();
    },
    router,
);

// error handling
app.use(errorHandler);
// not found
app.use(notFound);

export default app;
