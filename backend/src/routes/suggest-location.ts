import { GoogleGenerativeAI } from '@google/generative-ai';
import { Router } from 'express';
import multer from 'multer';
import { authenticateUser } from '../utils/authenticateUser';
import { getLocations } from './locations';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
  if (req.file) {
    try {
      const locations = await getLocations();
      if (!locations) {
        throw new Error();
      }
      const locationList = locations.rows.map((loc) => loc.value);
      console.log(locationList);
      const prompt = `Respond with the most appropriate tag option which best describes the image from this list, with no other formatting: ${locationList}. If none fit, respond with "no suggestion"`;
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
      const rawSuggestion = result.response.text().trim();
      console.log(rawSuggestion);
      const suggestion = locationList.find((loc) => rawSuggestion.includes(loc)) || rawSuggestion;
      res.status(201).json({ result: suggestion });
    } catch (err: unknown) {
      console.log('error');
      console.error((err as Error).message);
      res.status(201).json({ result: (err as Error).message });
      // res.status(500);
    }
  }
});

export default router;
