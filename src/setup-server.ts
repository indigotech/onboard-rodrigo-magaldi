import { ApolloServer } from 'apollo-server';
import { User } from 'entity/user';
import { resolvers } from 'graphql/resolvers';
import { typeDefs } from 'graphql/typeDefs';
import { createConnection } from 'typeorm';

import dotenv from 'dotenv';

export async function setup() {
  dotenv.config();
  await connectToDatabase();
  await runServer();
}

async function connectToDatabase() {
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User],
    synchronize: true,
    logging: false,
  });
  console.log('Database connection successful');
}

export async function runServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.listen();
  console.log('Server listening on default port');
}
