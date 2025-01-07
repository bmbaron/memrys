import bcrypt from 'bcrypt';
import 'dotenv/config';
import { Router } from 'express';
import pool from '../dbConfig';

const router = Router();
router.post('/', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const newPool = await pool.connect();
  if (!name || !email || !password || !password2) {
    return res.status(400).json({ error: 'Please make sure all fields are filled out' });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [name, email, hashedPassword];
    const queryText = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
    await newPool.query(queryText, values);
    newPool.release();
    return res.status(201).json({ message: 'success' });
  }

});
export default router;
