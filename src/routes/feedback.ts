import express from 'express';
import {
  ICreateFeedbackRequest,
  IGetFeedbackRequest,
} from '../models/feedback.model';
import { DynamoDbOperations } from '../dynamo/dynamo.class';

export const router = express.Router();

router.post('/feedback', async (req, res) => {
  const body: ICreateFeedbackRequest = req.body;
  if (!body.name || !body.message || !Number.isFinite(body.rating)) {
    return res.status(400).send();
  }

  await new DynamoDbOperations().putItemInFeedbacksTable(body);
  return res.send(true);
});

router.get('/feedback', async (req, res) => {
  const body: IGetFeedbackRequest = req.body;

  const feedbacks =
    await new DynamoDbOperations().getFeedbacksFromFeedbacksTable(body);

  return res.send(feedbacks);
});
