import { GoogleGenerativeAI } from '@google/generative-ai';
import { Router } from 'express';
import multer from 'multer';
import { authenticateUser } from '../middlewares/authenticateUser';
import { getLocations } from './locations';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
  if (req.file) {
    try {
      const locations = await getLocations();
      if (!locations) {
        throw new Error();
      }
      const locationList = locations.rows.map((loc) => loc.value);
      const prompt = `Respond with an appropriate option that describes the image: ${locationList}. If none, suggest a category of one to two word`;
      const inlineData = {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      };
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt
              },
              { inlineData }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.0
        }
      });
      const trimmedResult = result.response.text().trim();
      res.status(201).json({ result: trimmedResult });
    } catch (err: unknown) {
      console.log('error');
      console.error((err as Error).message);
      res.status(500);
    }
  }
});

export default router;
