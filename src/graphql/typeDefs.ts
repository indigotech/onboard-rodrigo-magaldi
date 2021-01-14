import { gql } from 'apollo-server'

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

  type Query {
    hello: String!
  }

  type Mutation {
    login(email: String!, password: String!, rememberMe: Boolean): Login!
  }
`);
