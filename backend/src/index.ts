import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { authenticateUser } from './middlewares/authenticateUser';
import LocationsRoute from './routes/locations';
import LoginRoute from './routes/login';
import MemrysRoute from './routes/memrys';
import MonthMemrysRoute from './routes/month-memrys';
import RegisterRoute from './routes/register';
import TagsRoute from './routes/tags';

export interface RequestWithID extends Request {
  userID?: string;
}
export const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
  }),
  express.json()
);

app.get('/', authenticateUser, (req: RequestWithID, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.use('/tags', TagsRoute);
app.use('/locations', LocationsRoute);
app.use('/memrys', MemrysRoute);
app.use('/month-memrys', MonthMemrysRoute);
app.use('/register', RegisterRoute);
app.use('/login', LoginRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
