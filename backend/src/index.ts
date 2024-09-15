import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import LocationsRoute from '../routes/locations';
import TagsRoute from '../routes/tags';
export const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ['http://localhost:5173']
  }),
  express.json()
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.use('/tags', TagsRoute);

app.use('/locations', LocationsRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
