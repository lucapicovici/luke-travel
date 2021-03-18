import express from 'express';
const router = express.Router();

router.route('/').get((req, res, next) => {
  res.json('hotels route');
})

export default router;