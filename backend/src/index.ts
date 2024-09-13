import express, { Request, Response } from 'express';
import 'dotenv/config'
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
  origin: ['http://localhost:5173']
}));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.get('/tester', (req: Request, res: Response) => {
  res.json({test: ["test", "connect"]} )
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});