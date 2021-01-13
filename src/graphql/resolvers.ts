import { LoginInterface } from "./interfaces";

export const resolvers = {
  Query: {
    hello: (): String => "Hello, world!"
  },

  Mutation: {
  login: (_: unknown, { email, password }: LoginInterface) => {
      if (email && password) {
        return {
          user: {
            id: 1,
            name: 'rodrigo',
            email: 'rod.magaldi@gmail.com',
            birthDate: '02-04-1999',
            cpf: '12312312312',
          },
          token: 'my_token',
        };
      }
    }
  }
};
