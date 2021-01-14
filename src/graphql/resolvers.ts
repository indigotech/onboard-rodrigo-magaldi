import { login } from "datasource/login";
import { LoginInterface } from "graphql/interfaces";

export const resolvers = {
  Query: {
    hello: (): String => "Hello, world!"
  },

  Mutation: {
  login: async (_: unknown, { email, password }: LoginInterface) => {
    const { user, token } = await login({email, password});
    return {
      user,
      token
    };
    }
  }
};
