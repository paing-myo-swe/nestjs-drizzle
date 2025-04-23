import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { posts } from './posts.schema';
import { comments } from './comments.schema';
import { profileInfo } from './profileInfo.schema';
import { usersToGroups } from './groups.schema';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profileInfo: one(profileInfo, {
    fields: [users.id],
    references: [profileInfo.userId],
  }),
  posts: many(posts),
  comments: many(comments),
  usersToGroups: many(usersToGroups),
}));
