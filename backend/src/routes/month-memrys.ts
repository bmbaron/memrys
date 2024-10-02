import 'dotenv/config';
import { Router } from 'express';
import pool from '../dbConfig';
import { authenticateUser } from '../middlewares/authenticateUser';

const router = Router();
router.get('/', authenticateUser, async (req, res) => {
  const month = req.query.month as string;
  const newPool = await pool.connect();
  try {
    const query = `SELECT * FROM submissions WHERE DATE_PART('YEAR', created_at) = DATE_PART('YEAR', $1::DATE) AND DATE_TRUNC('MONTH', created_at) = $1::DATE`;
    const values = [month];
    const result = await newPool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    if (newPool) {
      newPool.release();
    }
  }
});
export default router;
