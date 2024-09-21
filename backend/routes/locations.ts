import 'dotenv/config';
import { Router } from 'express';
import pool from '../src/dbConfig';

const router = Router();
router.get('/', async (req, res) => {
  let newPool = await pool.connect();
  try {
    const result = await newPool.query('SELECT * FROM locations');
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
  let newPool = await pool.connect();
  try {
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ error: 'Location is required' });
    }
    const queryText = 'INSERT INTO locations (value) VALUES ($1) RETURNING id';
    const values = [value];
    const result = await newPool.query(queryText, values);
    const newTagId = result.rows[0].id;
    res.status(201).send(`Location added with ID: ${newTagId}`);
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
