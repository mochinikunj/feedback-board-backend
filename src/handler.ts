import express from 'express';
import ServerlessHttp from 'serverless-http';
import { feedback, healthCheck } from './routes';

export const app = express();

// adding json parsing middleware
app.use(express.json());

// backend routes
app.use(healthCheck);
app.use(feedback);

// creating and serverless wrapper to run express on lambda
export const feedbackApisHandler = ServerlessHttp(app, {
  request: (req: any, event: any) => {
    if (typeof event.body === 'string') {
      try {
        req.body = JSON.parse(event.body);
      } catch {
        req.body = event.body;
      }
    }
  },
});
