import { login } from 'datasource/login';
import { createUser } from 'datasource/create-user';
import { CreateuserInterface, IDInterface, LoginInterface } from 'graphql/interfaces';
import { isTokenValid } from 'provider/token-validation-provider';
import { CustomError } from 'error/errors';
import { queryUser } from 'datasource/query-user';

export const resolvers = {
  Query: {
    hello: (): String => 'Hello, world!',
    user: async (_: unknown, { id }: IDInterface, context) => {
      if (!isTokenValid(context['token'])) {
        throw new CustomError('JWT inválido.', 401, 'Operação não autorizada.');
      }
      const { user } = await queryUser(id);
      return { user };
    },
  },

  Mutation: {
    login: async (_: unknown, { loginInput }: { loginInput: LoginInterface }) => {
      const { user, token } = await login(loginInput.email, loginInput.password, loginInput.rememberMe);
      return {
        user,
        token: token,
      };
    },
    createUser: async (_: unknown, { createUserInput }: { createUserInput: CreateuserInterface }, context) => {
      if (!isTokenValid(context['token'])) {
        throw new CustomError('JWT inválido.', 401, 'Operação não autorizada.');
      }
      return createUser(
        createUserInput.name,
        createUserInput.email,
        createUserInput.birthDate,
        createUserInput.cpf,
        createUserInput.password,
      );
    },
  },
};
