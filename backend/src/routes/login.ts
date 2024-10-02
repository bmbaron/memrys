import bcrypt from 'bcrypt';
import 'dotenv/config';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../dbConfig';

const router = Router();
router.get('/', async (req, res) => {
  const email = req.query.email as string;
  const password = req.query.password as string;
  console.log(email, password);
  const newPool = await pool.connect();
  try {
    const values = [email];
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await newPool.query(query, values);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          throw err;
        }
        if (result === true) {
          jwt.sign(
            {
              userID: user.id as number
            },
            process.env.JWT_SECRET!,
            { expiresIn: '2000s' },
            (err, token) => {
              if (err) {
                throw err;
              }
              if (token) {
                res.cookie('token', token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'strict',
                  path: '/'
                });
                res.json({ message: `Welcome back ${user.name}!` });
              }
            }
          );
        } else if (result === false) {
          res.setHeader('401', 'invalid login');
          console.log('invalid password');
          res.send({});
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
