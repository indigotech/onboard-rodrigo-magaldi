import { User } from "entity/user";
import { getRepository } from "typeorm";
import { LoginInterface } from "graphql/interfaces";
import { compareHash } from "provider/hash-provider";

import auth from '../config/auth';
import { sign } from "jsonwebtoken";

export const login = async ({email, password, rememberMe}: LoginInterface): Promise<{user: User | undefined, token: string}> => {

  const user = await getRepository(User).findOne({
    where: { email: email }
  });

  if (!user) {
    throw Error("Credenciais inválidas.")
  }

  const passwordMatched = await compareHash(password, user.password)

  if (!passwordMatched) {
    throw Error("Credenciais inválidas.")
  }

  const { secret, expiresIn, rememberMeExpiresIn } = auth.jwt;

  const token = sign({ id: user.id }, secret, {
    expiresIn: (rememberMe ? rememberMeExpiresIn : expiresIn)
  })

  return { user, token };
};
