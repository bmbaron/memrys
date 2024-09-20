import 'dotenv/config';
import { Router } from 'express';
import { PoolClient } from 'pg';
import pool from '../src/dbConfig';

const router = Router();
router.get('/', async (req, res) => {
  const date = req.query.date as string;
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    // const query = 'SELECT * FROM submissions WHERE date::date > $1';
    const query = 'SELECT * FROM submissions WHERE created_at = $1';
    let now_utc = new Date(date);
    const values = [now_utc];
    const result = await client.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

router.post('/',  (req, res) => {
  const { name, email, password, password2 } = req.body;
  console.log(req.body);

  let errors = [];

  if (!name || !email || !password || !password2) {

  }
});
export default router;
