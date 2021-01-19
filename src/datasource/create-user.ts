import { User } from 'entity/user';
import { CreateuserInterface } from 'graphql/interfaces';
import jwt from 'jsonwebtoken';

export const createUser = async ({ name, email, birthDate, cpf, password }: CreateuserInterface) => {
  const user = new User();
  user.id = 1230;
  user.name = name;
  user.email = email;
  user.birthDate = birthDate;
  user.cpf = cpf;
  user.password = password;

  return { user };
};
