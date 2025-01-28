/* eslint-disable no-console */
import app from './app';
import config from './app/config';

import mongoose from 'mongoose';
import { Server } from 'http';

export let server: Server;

async function startServer() {
    await mongoose.connect(config.databaseUrl as string);
    server = app.listen(config.port, () => {
        console.log(`Server is listening on port ${config.port}`);
    });
}

startServer();

process.on('unhandledRejection', () => {
    console.log('Shutting down server due to unhandled promise rejection');

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});


process.on('uncaughtException', () => {
    console.log('Shutting down server due to uncaughtException error');
    process.exit(1);
});
