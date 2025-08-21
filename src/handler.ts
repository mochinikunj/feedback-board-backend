import express from 'express';
import ServerlessHttp from 'serverless-http';
import { feedback, healthCheck } from './routes';

export const app = express();

app.use(express.json());

app.use(healthCheck);
app.use(feedback);

export const feedbackApisHandler = ServerlessHttp(app);
