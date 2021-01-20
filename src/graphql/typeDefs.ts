import { gql } from 'apollo-server';

export const typeDefs = gql(`
  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
  }

  type ReturnLogin {
    user: User!
    token: String!
  }

  type ReturnUser {
    user: User!
  }

  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean
  }

  input CreateUserInput {
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
    password: String!
  }

  type Query {
    hello: String!
    user(id: ID!): ReturnUser!
  }

  type Mutation {
    login(loginInput: LoginInput!): ReturnLogin!
    createUser(createUserInput: CreateUserInput!): ReturnUser!
  }
`);
