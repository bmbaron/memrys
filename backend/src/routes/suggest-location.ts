import { GoogleGenerativeAI } from '@google/generative-ai';
import { Router } from 'express';
import multer from 'multer';
import { authenticateUser } from '../utils/authenticateUser.js';
import { getLocations } from './locations.js';
import { uploadFile } from './memrys.js';

const router = Router();

const storage = multer.memoryStorage();
multer({ storage: storage });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
router.post('/', authenticateUser, uploadFile, async (req, res) => {
  if (req.file) {
    try {
      const locations = await getLocations();
      if (!locations) {
        throw new Error();
      }
      const locationList = locations.rows.map((loc) => loc.value);
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
      if (
        rawSuggestion.includes('GoogleGenerativeAI Error') ||
        rawSuggestion.includes('no suggestion')
      ) {
        throw new Error("Can't analyze this image");
      }
      const suggestion = locationList.find((loc) => rawSuggestion.includes(loc)) || rawSuggestion;
      res.status(201).json({ result: suggestion });
    } catch (err: unknown) {
      //TODO find a better way to show that the model is unavailable, error.status = 503
      console.error(err as Error);
    }
  }
});

export default router;
