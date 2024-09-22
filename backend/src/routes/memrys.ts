import 'dotenv/config';
import { Router } from 'express';
import pool from '../dbConfig';

const router = Router();
router.get('/', async (req, res) => {
  const date = req.query.date as string;
  if (req.headers.cookie) {
    console.log(req.headers.cookie || 'no cookie');
  } else console.log('no');
  const newPool = await pool.connect();
  try {
    const query = 'SELECT * FROM submissions WHERE created_at = $1';
    const now_utc = new Date(date);
    const values = [now_utc];
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

router.post('/', async (req, res) => {
  const newPool = await pool.connect();
  try {
    const { dateUTC, title, tag, location } = req.body;
    if (!title || !tag || !location) {
      return res.status(400).json({ error: 'Missing title, tag, or location' });
    }
    const queryText =
      'INSERT INTO submissions (created_at, title, tag, location) VALUES ($1, $2, $3, $4) RETURNING title';
    const values = [dateUTC, title, tag, location];
    const result = await newPool.query(queryText, values);
    res.status(201).json({
      message: `Added memry: ${result.rows[0].title}`
    });
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
