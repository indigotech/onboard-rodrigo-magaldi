import { login } from 'datasource/login';
import { createUser } from 'datasource/create-user';
import { CreateuserInterface, LoginInterface } from 'graphql/interfaces';
import { tokenIsValid } from 'provider/token-validation-provider';
import { CustomError } from 'error/errors';
import { queryUser } from 'datasource/query-user';

export const resolvers = {
  Query: {
    hello: (): String => 'Hello, world!',
    user: async (_: unknown, { id }: { id: number }, context) => {
      if (!tokenIsValid(context['token'])) {
        throw new CustomError('JWT inválido.', 401, 'Operação não autorizada.');
      }
      const { user } = await queryUser(id);
      return { user };
    },
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
        throw new CustomError('JWT inválido.', 401, 'Operação não autorizada.');
      }
      const { user } = await createUser({ name, email, birthDate, cpf, password });
      return { user };
    },
  },
};
