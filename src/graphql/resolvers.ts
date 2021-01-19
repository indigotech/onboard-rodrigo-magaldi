import { login } from 'datasource/login';
import { createUser } from 'datasource/create-user';
import { CreateuserInterface, LoginInterface } from 'graphql/interfaces';
import { tokenIsValid } from 'provider/token-validation-provider';

export const resolvers = {
  Query: {
    hello: (): String => 'Hello, world!',
  },

  Mutation: {
    login: async (_: unknown, { email, password, rememberMe }: LoginInterface) => {
      const { user, token } = await login({ email, password, rememberMe });
      return {
        user,
        token: token,
      };
    },
    createUser: async (_: unknown, { name, email, birthDate, cpf, password }: CreateuserInterface, context) => {
      if (!tokenIsValid(context['token'])) {
        throw Error('JWT inválido');
      }
      const { user } = await createUser({ name, email, birthDate, cpf, password });
      return { user };
    },
  },
};
