import { getRepository } from "typeorm";
import { User } from "../entity/user";
import { LoginInterface } from "../graphql/interfaces";
import { HashProvider } from "../provider/hashProvider";

import auth from '../config/auth';
import { sign } from "jsonwebtoken";


export const login = async ({email, password}: LoginInterface): Promise<{user: User | undefined, token: string}> => {
  const hashProvider = new HashProvider();

  const user = await getRepository(User).findOne({
    where: { email: email }
  });

  if (!user) {
    throw Error("Usuário não encontrado!")
  }

  const passwordMatched = (password === user.password)
  //await hashProvider.compareHash(password, user.password)

  if (!passwordMatched) {
    throw Error("Senha incorreta! Tente novamente.")
  }

  const { secret, expiresIn } = auth.jwt;

  const token = sign({ id: user.id }, secret, {
    expiresIn: expiresIn
  })

  return { user, token };
};
