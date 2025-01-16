import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  res.clearCookie('token', { path: '/' }); // Clear the cookie
  res.json({ status: 200, message: 'Logged out successfully' });
});

export default router;