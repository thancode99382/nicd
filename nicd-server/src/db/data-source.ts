import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from infra/.env.local
dotenv.config({ path: path.resolve(__dirname, '../../../infra/.env.local') });

// Fallback to infra/.env.production if .env.local doesn't exist
dotenv.config({ path: path.resolve(__dirname, '../../../infra/.env.production') });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nicd',
  
  // Entities - include all entity files (use dist for compiled, src for dev)
  entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
  
  // Migrations (use dist for compiled, src for dev)
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
  
  // Synchronize should be false when using migrations
  synchronize: false,
  
  // Logging
  logging: process.env.NODE_ENV !== 'production',
};

// DataSource instance for TypeORM CLI
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
