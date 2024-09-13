import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import TesterRoute from '../routes/tester';
export const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ['http://localhost:5173']
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.use('/tester', TesterRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
