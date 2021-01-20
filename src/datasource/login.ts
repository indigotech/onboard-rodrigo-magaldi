import { User } from 'entity/user';
import { getRepository } from 'typeorm';
import { LoginInterface } from 'graphql/interfaces';
import { compareHash } from 'provider/hash-provider';
import { CustomError } from 'error/errors';
import { sign } from 'jsonwebtoken';
import { isEmailValid } from 'provider/email-validation-provider';
import { generateToken } from 'provider/token-provider';

export const login = async (
  email: string,
  password: string,
  rememberMe?: boolean,
): Promise<{ user: User | undefined; token: string }> => {
  if (!isEmailValid(email)) {
    throw new CustomError('E-mail inválido.', 400, 'E-mail indicado não condizente.');
  }

  const user = await getRepository(User).findOne({
    where: { email: email },
  });

  if (!user) {
    throw new CustomError('Credenciais inválidas.', 401, 'Combinação email/senha inexistente.');
  }

  const passwordMatched = await compareHash(password, user.password);

  if (!passwordMatched) {
    throw new CustomError('Credenciais inválidas.', 401, 'Combinação email/senha inexistente.');
  }

  const token = generateToken(user.id, rememberMe);

  return { user, token };
};
