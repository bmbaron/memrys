import bcrypt from 'bcrypt';
import 'dotenv/config';
import { Router } from 'express';
import pool from '../src/dbConfig';

const router = Router();
router.post('/', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let newPool = await pool.connect();
  if (!name || !email || !password || !password2) {
    return res.status(400).json({ error: 'Please make sure all fields are filled out' });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    const values = [name, email, hashedPassword];
    const queryText = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id';
    const result = await newPool.query(queryText, values);
    const newTagId = result.rows[0].id;
    console.log(newTagId);
    return res.status(201).json({});
  }
  if (newPool) {
    newPool.release();
  }
});
export default router;
