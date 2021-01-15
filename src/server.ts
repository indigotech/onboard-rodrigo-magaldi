import 'reflect-metadata';
import { setup } from "setup-server";
// import { ApolloServer } from 'apollo-server';

// import { connection } from 'db/connection';

// import { typeDefs } from 'graphql/typeDefs';
// import { resolvers } from 'graphql/resolvers';

// export const setupServer = (): ApolloServer => {
//   const server = new ApolloServer({ typeDefs, resolvers });
//   return server;
// }

// export const startServer = async () => {
//   connection();
//   const server = setupServer();
//   await server.listen(3030, () => console.log("Server listening on port 3030"));
// }

// startServer();

setup();
