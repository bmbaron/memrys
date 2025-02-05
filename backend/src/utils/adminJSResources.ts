import * as AdminJSExpress from '@adminjs/express';
import { Adapter, Database, Resource } from '@adminjs/sql';
import AdminJS from 'adminjs';
import Connect from 'connect-pg-simple';
import session from 'express-session';
import { connectionString } from '../dbConfig.js';

const ConnectSession = Connect(session);
const sessionStore = new ConnectSession({
  conObject: {
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production'
  },
  tableName: 'session',
  createTableIfMissing: true
});

const DEFAULT_ADMIN = {
  email: 'admin@memrys.com',
  password: '123123123'
};

AdminJS.registerAdapter({
  Database,
  Resource
});

const db = await new Adapter('postgresql', {
  connectionString: connectionString,
  database: process.env.DB_PROD_NAME!,
  schema: 'public'
}).init();

export const admin = new AdminJS({
  resources: [
    {
      resource: db.table('enrolled_users'),
      schema: 'public',
      options: {}
    },
    {
      resource: db.table('submissions'),
      schema: 'public',
      options: {}
    },
    {
      resource: db.table('locations'),
      schema: 'public',
      options: {}
    },
    {
      resource: db.table('tags'),
      schema: 'public',
      options: {}
    }
  ]
});

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

export const adminJSRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate,
    cookieName: 'adminjs',
    cookiePassword: 'sessionsecret'
  },
  null,
  {
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    secret: 'sessionsecret',
    cookie: {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production'
    },
    name: 'adminjs'
  }
);
