import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const healthStatus = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date(),
  };
  res.status(200).json(healthStatus);
});

export default router;