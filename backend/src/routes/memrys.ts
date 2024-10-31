import 'dotenv/config';
import { Router } from 'express';
import multer from 'multer';
import pool from '../dbConfig';
import { RequestWithID } from '../index';
import { authenticateUser } from '../utils/authenticateUser';
import { getURLsFromS3, uploadToS3 } from '../utils/imageOperations';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.get('/', authenticateUser, async (req: RequestWithID, res) => {
  const date = req.query.date as string;
  const userID = req.userID;
  const newPool = await pool.connect();
  try {
    const query = 'SELECT * FROM submissions WHERE user_id = $1::BIGINT AND created_at = $2';
    const now_utc = new Date(date);
    const values = [userID, now_utc];
    const result = await newPool.query(query, values);
    if (result && result.rows[0] && result.rows[0].image_key) {
      const urls = await getURLsFromS3(result.rows[0].image_key);
      if (urls) {
        result.rows[0].thumbnailURL = urls[0];
        result.rows[0].mainURL = urls[1];
      }
    }
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

router.post('/', authenticateUser, upload.single('image'), async (req: RequestWithID, res) => {
  const newPool = await pool.connect();
  try {
    const { dateUTC, title, tag, location, notes } = req.body;
    const userID = req.userID;
    if (!title || !tag || !location) {
      return res.status(400).json({ error: 'Missing title, tag, location' });
    }
    if (!userID) {
      return res.status(400).json({ error: 'User is not authenticated' });
    }
    let imageKey = null;
    if (req.file) {
      imageKey = await uploadToS3(userID, req.file);
    }
    const queryText =
      'INSERT INTO submissions (created_at, title, tag, location, image_key, notes, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING title';
    const values = [dateUTC, title, tag, location, imageKey, notes || null, userID];
    const result = await newPool.query(queryText, values);
    res.status(201).json({
      message: `Added memry: ${result.rows[0].title}`
    });
  } catch (err: unknown) {
    console.error((err as Error).message);
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    if (newPool) {
      newPool.release();
    }
  }
});

router.put('/', authenticateUser, upload.single('image'), async (req: RequestWithID, res) => {
  const newPool = await pool.connect();
  try {
    console.log(req.body);
    const { dateUTC, title, tag, location, notes } = req.body;
    const dateFixed = new Date(dateUTC);
    const userID = req.userID;
    if (!title || !tag || !location) {
      return res.status(400).json({ error: 'Missing title, tag, location' });
    }
    if (!userID) {
      return res.status(400).json({ error: 'User is not authenticated' });
    }
    let imageKey = null;
    if (req.file) {
      imageKey = await uploadToS3(userID, req.file);
    }
    const queryText =
      'UPDATE submissions SET title = $2, tag = $3, location = $4, image_key = $5, notes = $6 WHERE created_at = $1 AND user_id = $7';
    const values = [dateFixed, title, tag, location, imageKey, notes || null, userID];
    const result = await newPool.query(queryText, values);
    console.log(result);
    res.status(201).json({
      message: `Updated memry`
    });
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
