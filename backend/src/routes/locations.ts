import 'dotenv/config';
import { Router } from 'express';
import pool from '../dbConfig';

const router = Router();
export const getLocations = async () => {
  const newPool = await pool.connect();
  try {
    const result = await newPool.query('SELECT * FROM locations');
    return result;
  } catch (err: unknown) {
    console.error((err as Error).message);
  } finally {
    if (newPool) {
      newPool.release();
    }
  }
};
router.get('/', async (req, res) => {
  try {
    const locations = await getLocations();
    if (!locations) {
      throw new Error();
    }
    res.json(locations.rows);
  } catch (err: unknown) {
    console.error((err as Error).message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/', async (req, res) => {
  const newPool = await pool.connect();
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
