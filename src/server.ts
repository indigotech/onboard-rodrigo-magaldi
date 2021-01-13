import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';

import './db/connection';

const typeDefs = gql(`
    type Query {
        hello: String
    }
`);

const resolvers = {
  Query: {
    hello: () => "Hello, world!"
  }
};

const server = new ApolloServer({ typeDefs, resolvers })

server.listen(3030, () => console.log("Server listening on port 3030"));
