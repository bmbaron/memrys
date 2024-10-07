import { GoogleGenerativeAI } from '@google/generative-ai';
import { Router } from 'express';
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
router.post('/', upload.single('image'), async (req, res) => {
  if (req.file) {
    try {
      const prompt = 'what is it?';
      const imageData = {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: 'image/png'
        }
      };
      const result = await model.generateContent([prompt, imageData]);
      console.log(result.response.text());
    } catch (err: unknown) {
      console.log('error');
      console.error((err as Error).message);
      res.status(500);
    }
  }
});

export default router;
