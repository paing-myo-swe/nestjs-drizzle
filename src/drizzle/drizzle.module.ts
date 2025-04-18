import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as Schema from './schema/schema'; // Adjust the import path as necessary

export const DRIZZLE = Symbol('drizzle-connection');

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Initialize your Drizzle connection here
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const pool = new Pool({
          connectionString: databaseUrl,
          ssl: true,
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof Schema>;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
