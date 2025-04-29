
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';
import 'dotenv/config';

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a connection pool
export const pool = new Pool({ connectionString: databaseUrl });

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });
