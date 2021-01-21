import { login } from 'datasource/login';
import { createUser } from 'datasource/create-user';
import { ICreateUserInput, IIDInput, ILoginInput } from 'graphql/interfaces';
import { isTokenValid } from 'provider/token-validation-provider';
import { CustomError } from 'error/errors';
import { queryUser } from 'datasource/query-user';

export const resolvers = {
  Query: {
    hello: (): String => 'Hello, world!',
    user: (_, { id }: IIDInput, context) => {
      if (!isTokenValid(context['token'])) {
        throw new CustomError('JWT inválido.', 401, 'Operação não autorizada.');
      }
      return queryUser(id);
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
