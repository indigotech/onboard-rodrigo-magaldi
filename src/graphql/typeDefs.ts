import { gql } from 'apollo-server';

export const typeDefs = gql(`
  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
  }

  type Login {
    user: User!
    token: String!
  }

  type ReturnUser {
    user: User!
  }

  type Query {
    hello: String!
    user(id: ID!): ReturnUser!
  }

  type Mutation {
    login(email: String!, password: String!, rememberMe: Boolean): Login!
    createUser(name: String!, email: String!, birthDate: String!, cpf: String!, password: String!): ReturnUser!
  }
`);
