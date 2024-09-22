import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import LocationsRoute from './routes/locations';
import LoginRoute from './routes/login';
import MemrysRoute from './routes/memrys';
import RegisterRoute from './routes/register';
import TagsRoute from './routes/tags';

export const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
  }),
  express.json()
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
});

app.use('/tags', TagsRoute);
app.use('/locations', LocationsRoute);
app.use('/memrys', MemrysRoute);
app.use('/register', RegisterRoute);
app.use('/login', LoginRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
