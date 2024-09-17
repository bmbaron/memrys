import 'dotenv/config';
import { Router } from 'express';
import { PoolClient } from 'pg';
import pool from '../src/db';

const router = Router();
router.get('/', async (req, res) => {
  const { date } = req.query;
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    // const query = 'SELECT * FROM submissions WHERE date::date > $1';
    const query = 'SELECT * FROM submissions WHERE (date)::date = $1';
    let now_utc = new Date(new Date().toUTCString());
    const values = [now_utc];
    const result = await client.query(query, values);
    console.log(result.rows.length);
    res.json(result.rows);
    // console.log(result)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

router.post('/', async (req, res) => {
  console.log(req.body);
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    const { title, tag, location } = req.body;
    if (!title || !tag || !location) {
      return res.status(400).json({ error: 'Missing title, tag, or location' });
    }
    const queryText =
      'INSERT INTO submissions (title, tag, location) VALUES ($1, $2, $3) RETURNING id';
    const values = [title, tag, location];
    const result = await client.query(queryText, values);
    const newTagId = result.rows[0].id;
    res.status(201).send(`Submission added with ID: ${newTagId}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    if (client) {
      client.release();
    }
  }
});
export default router;
