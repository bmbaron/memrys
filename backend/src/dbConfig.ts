import 'dotenv/config';
import { Pool } from 'pg';

let connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

if (process.env.DB_IS_PROD === 'TRUE') {
  connectionString = `postgresql://${process.env.DB_PROD_USER}:${process.env.DB_PROD_PASSWORD}@${process.env.DB_PROD_HOST}:${process.env.DB_PROD_PORT}/${process.env.DB_PROD_NAME}`;
}

const pool = new Pool({
  connectionString: connectionString
});

export default pool;
