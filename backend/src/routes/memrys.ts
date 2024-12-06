import 'dotenv/config';
import { Router } from 'express';
import multer from 'multer';
import pool from '../dbConfig';
import { RequestWithID } from '../index';
import { authenticateUser } from '../utils/authenticateUser';
import { getURLsFromS3, removeOldImage, uploadToS3 } from '../utils/imageOperations';

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

// @ts-expect-error TODO: troubleshoot this
const uploadFile = (req, res, next) => {
  const multerUpload = upload.single('image');
  multerUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred
      console.log('Multer error:', err);
      next(err);
    } else if (err) {
      // An unknown error occurred
      console.log('Error:', err);
      next(err);
    }
    // Everything went fine, proceed
    next();
  });
};

router.post('/', authenticateUser, uploadFile, async (req: RequestWithID, res) => {
  const { dateUTC, title, tag, location, notes } = req.body;
  const userID = req.userID;
  const newPool = await pool.connect();
  try {
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
  const { dateUTC, title, tag, location, notes } = req.body;
  const dateFixed = new Date(dateUTC);
  const userID = req.userID;
  const newPool = await pool.connect();

  try {
    //only delete existing image if a new one was sent
    if (userID && req.file) {
      const deletedImageKey = await removeOldImage(userID, dateFixed);
      console.log(deletedImageKey);
    }
  } catch (err: unknown) {
    console.error((err as Error).message);
  }

  try {
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
    let queryUpdateMemry = '';
    if (imageKey) {
      queryUpdateMemry =
        'UPDATE submissions SET title = $2, tag = $3, location = $4, image_key = $5, notes = $6 WHERE created_at = $1 AND user_id = $7';
      const valuesUpdateWithImage = [
        dateFixed,
        title,
        tag,
        location,
        imageKey,
        notes || null,
        userID
      ];
      await newPool.query(queryUpdateMemry, valuesUpdateWithImage);
    } else {
      queryUpdateMemry =
        'UPDATE submissions SET title = $2, tag = $3, location = $4, notes = $5 WHERE created_at = $1 AND user_id = $6';
      const valuesUpdate = [dateFixed, title, tag, location, notes || null, userID];
      await newPool.query(queryUpdateMemry, valuesUpdate);
    }
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
