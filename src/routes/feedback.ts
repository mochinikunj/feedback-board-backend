import express from 'express';

export const router = express.Router();

router.get('/feedback', (req, res) => {
  return res.send('GET feedback...');
});

router.post('/feedback', (req, res) => {
  return res.send('POST feedback...');
});
