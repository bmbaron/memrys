import 'dotenv/config';
import express from 'express';
import { PoolClient } from 'pg';
import pool from '../src/db';

const router = express.Router();
router.use('/', async (req, res) => {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM tags');
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
export default router;
