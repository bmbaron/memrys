import 'dotenv/config';
import { Router } from 'express';
import pool from '../dbConfig';
import { RequestWithID } from '../index';
import { authenticateUser } from '../middlewares/authenticateUser';

const router = Router();
router.get('/', authenticateUser, async (req: RequestWithID, res) => {
  const month = req.query.month as string;
  const userID = req.userID;
  const newPool = await pool.connect();
  try {
    const query = `SELECT * FROM submissions WHERE user_id = $1::BIGINT AND DATE_PART('YEAR', created_at) = DATE_PART('YEAR', $2::DATE) AND DATE_TRUNC('MONTH', created_at) = $2::DATE`;
    const values = [userID, month];
    const result = await newPool.query(query, values);
    res.json(result.rows);
  } catch (err: unknown) {
    console.error((err as Error).message);
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    if (newPool) {
      newPool.release();
    }
  }
});
export default router;
