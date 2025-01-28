/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';


let server: Server;

process.on('uncaughtException', () => {
    console.error('Shutting down server due to uncaughtException error');
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    if (server) {
      server.close(() => {
        console.error('Server closed due to unhandled rejection');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
});

async function startServer() {
    try{
        await mongoose.connect(config.databaseUrl as string);
        console.log('Database connected');
        server = app.listen(config.port, () => {
            console.log(`Server is listening on port ${config.port}`);
        });
    }
    catch (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    }
}

startServer();


process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close(() => {
        console.log('Server closed due to SIGTERM');
        process.exit(0);
        });
    } else {
        process.exit(0);
    }
});
  
process.on('SIGINT', () => {
    console.log('SIGINT received');
    if (server) {
        server.close(() => {
        console.log('Server closed due to SIGINT');
        process.exit(0);
        });
    } else {
        process.exit(0);
    }
});