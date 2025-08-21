import express from 'express';
import ServerlessHttp from 'serverless-http';
import { healthCheck } from './routes';

export const app = express();

app.use(express.json());
app.use(healthCheck);

export const feedbackApisHandler = ServerlessHttp(app);
