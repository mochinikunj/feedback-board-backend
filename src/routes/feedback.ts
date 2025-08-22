import express from 'express';
import {
  ICreateFeedbackRequest,
  IGetFeedbackRequest,
} from '../models/feedback.model';
import isEmpty from 'validator/lib/isEmpty';
import { DynamoDbOperations } from '../dynamo/dynamo.class';

export const router = express.Router();

router.post('/feedback', async (req, res) => {
  const body: ICreateFeedbackRequest = req.body;

  const empty = Object.values(body).some((field) =>
    isEmpty(field, { ignore_whitespace: false }),
  );
  if (empty) {
    return res.status(400).send();
  }

  await new DynamoDbOperations().putItemInFeedbacksTable(body);
  return res.send(true);
});

router.get('/feedback', async (req, res) => {
  const body: IGetFeedbackRequest = req.body;

  const empty = Object.values(body).some((field) =>
    isEmpty(field, { ignore_whitespace: false }),
  );
  if (empty) {
    return res.status(400).send();
  }

  const feedbacks =
    await new DynamoDbOperations().getFeedbacksFromFeedbacksTable(body);

  return res.send(feedbacks);
});
