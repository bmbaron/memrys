import 'dotenv/config';
import { Router } from 'express';
import { PoolClient } from 'pg';
import pool from '../src/dbConfig';

const router = Router();
router.get('/', async (req, res) => {
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

router.post('/', async (req, res) => {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ error: 'Tag is required' });
    }
    const queryText = 'INSERT INTO tags (value) VALUES ($1) RETURNING id';
    const values = [value];
    const result = await client.query(queryText, values);
    const newTagId = result.rows[0].id;
    res.status(201).send(`Tag added with ID: ${newTagId}`);
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
