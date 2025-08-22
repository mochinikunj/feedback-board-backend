import express from 'express';
import {
  ICreateFeedbackRequest,
  IGetFeedbackRequest,
} from '../models/feedback.model';
import { DynamoDbOperations } from '../dynamo/dynamo.class';

export const router = express.Router();

// route to handle creation of the feedback in dynamo
router.post('/feedback', async (req, res) => {
  const body: ICreateFeedbackRequest = req.body;
  console.log('Create feedback request:', body);

  // basic validation for request fields
  if (
    !body.name ||
    !body.message ||
    !Number.isFinite(body.rating) ||
    body.rating < 1 ||
    body.rating > 5
  ) {
    return res.status(400).send('Bad user request!');
  }

  // making a dynamo call to create & store feedback
  await new DynamoDbOperations().putItemInFeedbacksTable(body);
  return res.send(true);
});

// route to handle listing the feedbacks from dynamo to UI
router.get('/feedback', async (req, res) => {
  const body: IGetFeedbackRequest = req.query;
  console.log('Get feedbacks request:', body);

  // fetching feedback list from dynamo
  const feedbacks =
    await new DynamoDbOperations().getFeedbacksFromFeedbacksTable(
      body as IGetFeedbackRequest,
    );

  // returning the feedback list back to UI
  return res.send(feedbacks);
});
