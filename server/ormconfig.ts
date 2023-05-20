import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const path = '.env';
if (fs.existsSync(path)) {
  dotenv.config({ path });
}

const connectTimeoutMS = process.env.DB_CONNECTION_TIMEOUT_MS
  ? parseInt(process.env.DB_CONNECTION_TIMEOUT_MS)
  : 5000;
const poolSize = process.env.DB_POOL_SIZE
  ? parseInt(process.env.DB_POOL_SIZE)
  : 100;
const statementTimeout = process.env.DB_STATEMENT_TIMEOUT
  ? parseInt(process.env.DB_STATEMENT_TIMEOUT)
  : 20000;

export const config = {
  name: 'default',
  type: 'postgres',
  connectTimeoutMS,
  retryAttempts: 20,
  retryDelay: 100,
  host: process.env.DB_HOST || 'localhost',
  applicationName: 'server-api',
  port: parseInt(process.env.DB_PORT as string) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'local',
  migrations: ['./dist/src/database/migrations/*.js'],
  entities: ['./dist/src/modules/**/*.entity.js'],
  migrationsRun: false,
  synchronize: false,
  logging: false,
  extra: {
    poolSize,
    allowExitOnIdle: true,
    idleTimeoutMillis: 10000,
    options: '-c lock_timeout=10000ms',
    statement_timeout: statementTimeout,
  },
} as DataSourceOptions;

export default new DataSource(config);
