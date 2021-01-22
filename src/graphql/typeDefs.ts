import { gql } from 'apollo-server';

export const typeDefs = gql(`
  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
    addresses: [Address!]!
  }

  type Address {
    id: ID!
    cep: String!
    street: String!
    streetNumber: Int!
    complement: String!
    neighborhood: String!
    city: String!
    state: String!
  }

  type UsersList {
    users: [User!]!
    count: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
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
    users(limit: Int = 10, offset: Int = 0): UsersList!
  }

  type Mutation {
    login(loginInput: LoginInput!): Login!
    createUser(createUserInput: CreateUserInput!): User!
  }
`);
