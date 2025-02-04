import 'dotenv/config';
import { Router } from 'express';
import pool from '../dbConfig.js';

const router = Router();
router.get('/', async (req, res) => {
  const newPool = await pool.connect();
  try {
    const result = await newPool.query('SELECT * FROM tags');
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

router.post('/', async (req, res) => {
  const newPool = await pool.connect();
  try {
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ error: 'Tag is required' });
    }
    const queryText = 'INSERT INTO tags (value) VALUES ($1) RETURNING id';
    const values = [value];
    const result = await newPool.query(queryText, values);
    const newTagId = result.rows[0].id;
    res.status(201).send(`Tag added with ID: ${newTagId}`);
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
