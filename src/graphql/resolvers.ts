import { login } from "../datasource/login";
import { LoginInterface } from "./interfaces";

export const resolvers = {
  Query: {
    hello: (): String => "Hello, world!"
  },

  Mutation: {
  login: async (_: unknown, { email, password }: LoginInterface) => {
    const user = await login({email, password});
    return {
      user,
      token: 'my_token',
    };
    }
  }
};
