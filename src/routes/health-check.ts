import express from 'express';
import { Status } from '../enums/feedback.enum';

export const router = express.Router();

router.get('/health-check', (req, res) => {
  return res.send({
    status: Status.OK,
    message: 'Server is up and running...',
  });
});
