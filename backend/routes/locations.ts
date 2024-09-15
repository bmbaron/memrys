import 'dotenv/config';
import { Router } from 'express';
import { PoolClient } from 'pg';
import pool from '../src/db';

const router = Router();
router.get('/', async (req, res) => {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM locations');
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

router.post('/', async (req, res) => {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ error: 'Location is required' });
    }
    const queryText = 'INSERT INTO locations (value) VALUES ($1) RETURNING id';
    const values = [value];
    const result = await client.query(queryText, values);
    const newTagId = result.rows[0].id;
    res.status(201).send(`Location added with ID: ${newTagId}`);
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
