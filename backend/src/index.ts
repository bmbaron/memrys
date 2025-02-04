import * as AdminJSExpress from '@adminjs/express';
import { Adapter, Database, Resource } from '@adminjs/sql';
import AdminJS from 'adminjs';
import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { connectionString } from './dbConfig.js';
import HealthCheck from './routes/healthcheck.js';
import LocationsRoute from './routes/locations.js';
import LoginRoute from './routes/login.js';
import LogoutRoute from './routes/logout.js';
import MemrysRoute from './routes/memrys.js';
import MonthMemrysRoute from './routes/month-memrys.js';
import RegisterRoute from './routes/register.js';
import SuggestRoute from './routes/suggest-location.js';
import TagsRoute from './routes/tags.js';
import { getAdminJSResources } from './utils/adminJSResources.js';
import { authenticateUser } from './utils/authenticateUser.js';

AdminJS.registerAdapter({
  Database,
  Resource
});

const db = await new Adapter('postgresql', {
  connectionString: connectionString,
  database: process.env.DB_PROD_NAME!,
  schema: 'public'
}).init();

const admin = new AdminJS({
  resources: getAdminJSResources(db)
});

const adminJSRouter = AdminJSExpress.buildRouter(admin);

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
