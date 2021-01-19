import { User } from 'entity/user';
import { getRepository } from 'typeorm';
import { LoginInterface } from 'graphql/interfaces';
import { compareHash } from 'provider/hash-provider';

import { sign } from 'jsonwebtoken';

export const login = async ({
  email,
  password,
  rememberMe,
}: LoginInterface): Promise<{ user: User | undefined; token: string }> => {
  const user = await getRepository(User).findOne({
    where: { email: email },
  });

  if (!user) {
    throw Error('Credenciais inválidas.');
  }

  const passwordMatched = await compareHash(password, user.password);

  if (!passwordMatched) {
    throw Error('Credenciais inválidas.');
  }

  const token = sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? process.env.JWT_REMEMBER_ME_EXPIRATION : process.env.JWT_EXPIRATION,
  });

  return { user, token };
};
