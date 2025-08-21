import express from 'express';

export const router = express.Router();

router.get('/health-check', (req, res) => {
  return res.send('Server is up and running...');
});
