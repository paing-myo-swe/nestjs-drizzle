import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';
import * as schema from './schema/schema'; // Adjust the import path as necessary
import { faker } from '@faker-js/faker';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

async function main() {
  const userIds = await Promise.all(
    Array(50)
      .fill('')
      .map(async () => {
        const user = await db
          .insert(schema.users)
          .values({
            email: faker.internet.email(),
            name: faker.name.fullName() + ' ' + faker.name.lastName(),
            password: '',
          })
          .returning();
        return user[0].id;
      }),
  );

  const postIds = await Promise.all(
    Array(50)
      .fill('')
      .map(async () => {
        const post = await db
          .insert(schema.posts)
          .values({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            authorId: faker.helpers.arrayElement(userIds),
          })
          .returning();
        return post[0].id;
      }),
  );

  await Promise.all(
    Array(50)
      .fill('')
      .map(async () => {
        const comment = await db
          .insert(schema.comments)
          .values({
            text: faker.lorem.paragraph(),
            authorId: faker.helpers.arrayElement(userIds),
            postId: faker.helpers.arrayElement(postIds),
          })
          .returning();
        return comment[0].id;
      }),
  );

  const insertedGroups = await db
    .insert(schema.groups)
    .values([
      {
        name: 'JS',
      },
      {
        name: 'TS',
      },
    ])
    .returning();

  const groupIds = insertedGroups.map((group) => group.id);

  await Promise.all(
    userIds.map(async (userId) => {
      return await db
        .insert(schema.usersToGroups)
        .values({
          userId,
          groupId: faker.helpers.arrayElement(groupIds),
        })
        .returning();
    }),
  );
}

main()
  .then(() => {
    console.log('Seeding completed successfully');
  })
  .catch((error) => {
    console.error('Error during seeding:', error);
  })
  .finally(() => {
    pool.end();
  });
