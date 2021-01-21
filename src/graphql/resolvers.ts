import { login } from 'datasource/login';
import { createUser } from 'datasource/create-user';
import { ICreateUserInput, IQueryUserInput, ILoginInput, IQueryUsersInput } from 'graphql/interfaces';
import { isTokenValid } from 'provider/token-validation-provider';
import { CustomError } from 'error/errors';
import { queryUser } from 'datasource/query-user';
import { queryUsers } from 'datasource/query-users';

export const resolvers = {
  Query: {
    hello: (): String => 'Hello, world!',
    user: (_, { id }: IQueryUserInput, context) => {
      if (!isTokenValid(context['token'])) {
        throw new CustomError('JWT inválido.', 401, 'Operação não autorizada.');
      }
      return queryUser(id);
    },
    users: (_, { limit, offset }: IQueryUsersInput, context) => {
      if (!isTokenValid(context['token'])) {
        throw new CustomError('JWT inválido.', 401, 'Operação não autorizada.');
      }
      return queryUsers(limit, offset);
    },
  },

  Mutation: {
    login: async (_: unknown, { loginInput }: { loginInput: ILoginInput }) => {
      return login(loginInput.email, loginInput.password, loginInput.rememberMe);
    },
    createUser: async (_: unknown, { createUserInput }: { createUserInput: ICreateUserInput }, context) => {
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
