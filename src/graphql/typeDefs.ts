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
    user(id: ID!): User!
  }

  type Mutation {
    login(loginInput: LoginInput!): Login!
    createUser(createUserInput: CreateUserInput!): User!
  }
`);
