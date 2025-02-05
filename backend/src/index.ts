import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import HealthCheck from './routes/healthcheck.js';
import LocationsRoute from './routes/locations.js';
import LoginRoute from './routes/login.js';
import LogoutRoute from './routes/logout.js';
import MemrysRoute from './routes/memrys.js';
import MonthMemrysRoute from './routes/month-memrys.js';
import RegisterRoute from './routes/register.js';
import SuggestRoute from './routes/suggest-location.js';
import TagsRoute from './routes/tags.js';
import { admin, adminJSRouter } from './utils/adminJSResources.js';
import { authenticateUser } from './utils/authenticateUser.js';

export interface RequestWithID extends Request {
  userID?: string;
}
export const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://memrys.netlify.app']
  }),
  express.json()
);

app.get('/', authenticateUser, (req: RequestWithID, res: Response) => {
  res.send({ status: 200, message: 'authenticated' });
});

app.use('/tags', TagsRoute);
app.use('/locations', LocationsRoute);
app.use('/memrys', MemrysRoute);
app.use('/month-memrys', MonthMemrysRoute);
app.use('/register', RegisterRoute);
app.use('/login', LoginRoute);
app.use('/logout', LogoutRoute);
app.use('/suggest-location', SuggestRoute);
app.use('/healthcheck', HealthCheck);
app.use(admin.options.rootPath, adminJSRouter);

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
server.timeout = 10000;
