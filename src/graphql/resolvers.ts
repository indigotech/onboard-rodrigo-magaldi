import { login } from "../datasource/login";
import { LoginInterface } from "./interfaces";

export const resolvers = {
  Query: {
    hello: (): String => "Hello, world!"
  },

  Mutation: {
  login: async (_: unknown, { email, password, rememberMe }: LoginInterface) => {
    const { user, token } = await login({email, password, rememberMe});
    return {
      user,
      token
    };
    }
  }
};
