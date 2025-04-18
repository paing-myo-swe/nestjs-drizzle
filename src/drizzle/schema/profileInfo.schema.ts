import { integer } from 'drizzle-orm/gel-core';
import { jsonb, pgTable, serial } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const profileInfo = pgTable('profileInfo', {
  id: serial('id').primaryKey(),
  metadata: jsonb('metadata').notNull(),
  userId: integer('userId')
    .references(() => users.id)
    .notNull(),
});
