import { User } from 'entity/user';
import { CustomError } from 'error/errors';
import { CreateuserInterface } from 'graphql/interfaces';
import { generateHash } from 'provider/hash-provider';
import { getRepository } from 'typeorm';

const passwordValidationRe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

export const createUser = async (name: string, email: string, birthDate: string, cpf: string, password: string) => {
  const emailInUse = await getRepository(User).findOne({
    where: { email: email },
  });

  if (emailInUse) {
    throw new CustomError('E-mail já cadastrado.', 409, 'E-mail informado já está em uso no sistema.');
  }

  const isPasswordValid = passwordValidationRe.test(String(password));
  if (!isPasswordValid) {
    throw new CustomError('Senha inadequada.', 403, 'Senha deve conter ao menos um dígito, uma letra e 7 caracteres.');
  }

  const hashedPassword = await generateHash(password);

  const user = getRepository(User).create({
    name,
    email,
    birthDate,
    cpf,
    password: hashedPassword,
  });

  await getRepository(User).save(user);

  return { user };
};
