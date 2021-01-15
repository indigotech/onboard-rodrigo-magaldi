import { ApolloServer } from 'apollo-server';
import { resolvers } from 'graphql/resolvers';
import { typeDefs } from 'graphql/typeDefs';
import { createConnection } from 'typeorm';

export async function setup() {
  await connectToDatabase();
  await runServer();
}

async function connectToDatabase() {
  await createConnection();
  console.log("Database connection successful");
}

export async function runServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.listen()
  console.log("Server listening on default port");
}
