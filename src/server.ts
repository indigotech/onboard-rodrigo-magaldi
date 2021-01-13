import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';

import './db/connection';

import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

const server = new ApolloServer({ typeDefs, resolvers })

server.listen(3030, () => console.log("Server listening on port 3030"));
