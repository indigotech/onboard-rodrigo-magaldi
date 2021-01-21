import { ApolloServer } from 'apollo-server';
import { User } from 'entity/user';
import { resolvers } from 'graphql/resolvers';
import { typeDefs } from 'graphql/typeDefs';
import { createConnection } from 'typeorm';
import { envConfig } from 'env-config';
import { formatError } from 'error/errors';

export async function setup() {
  envConfig();
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
  console.log('Database connection successful\n');
}

export async function runServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: formatError,
    context: ({ req }) => {
      return {
        token: req.headers.authorization,
      };
    },
  });

  await server.listen(process.env.PORT);
  console.log(`Server listening on port ${process.env.PORT}\n`);
}
