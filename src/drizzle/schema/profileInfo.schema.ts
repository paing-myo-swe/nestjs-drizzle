import { jsonb, pgTable, serial, integer } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const profileInfo = pgTable('profileInfo', {
  id: serial('id').primaryKey(),
  metadata: jsonb('metadata').notNull(),
  userId: integer('userId')
    .references(() => users.id)
    .notNull(),
});
