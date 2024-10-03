import 'dotenv/config';
import { Router } from 'express';
import pool from '../dbConfig';
import { RequestWithID } from '../index';
import { authenticateUser } from '../middlewares/authenticateUser';

const router = Router();
router.get('/', authenticateUser, async (req: RequestWithID, res) => {
  const date = req.query.date as string;
  const userID = req.userID;
  const newPool = await pool.connect();
  try {
    const query = 'SELECT * FROM submissions WHERE user_id = $1::BIGINT AND created_at = $2';
    const now_utc = new Date(date);
    const values = [userID, now_utc];
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

router.post('/', authenticateUser, async (req: RequestWithID, res) => {
  // const userID = req.userID;
  const newPool = await pool.connect();
  try {
    const { dateUTC, title, tag, location } = req.body;
    const userID = req.userID;
    if (!title || !tag || !location) {
      return res.status(400).json({ error: 'Missing title, tag, location' });
    }
    if (!userID) {
      return res.status(400).json({ error: 'User is not authenticated' });
    }
    const queryText =
      'INSERT INTO submissions (created_at, title, tag, location, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING title';
    const values = [dateUTC, title, tag, location, userID];
    const result = await newPool.query(queryText, values);
    res.status(201).json({
      message: `Added memry: ${result.rows[0].title}`
    });
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
