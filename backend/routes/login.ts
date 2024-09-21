import bcrypt from 'bcrypt';
import 'dotenv/config';
import { Router } from 'express';
import pool from '../src/dbConfig';

const router = Router();
router.get('/', async (req, res) => {
  const email = req.query.email as string;
  const password = req.query.password as string;
  let newPool = await pool.connect();
  try {
    const values = [email];
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await newPool.query(query, values);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          throw err;
        }
        if (result) {
          res.json({ message: `Welcome back ${user.name}!` });
        }
      });
    }
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
