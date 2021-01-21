import { User } from 'entity/user';
import { CustomError } from 'error/errors';
import { CreateuserInterface } from 'graphql/interfaces';
import { generateHash } from 'provider/hash-provider';
import { getRepository } from 'typeorm';

export const createUser = async ({ name, email, birthDate, cpf, password }: CreateuserInterface) => {
  const emailInUse = await getRepository(User).findOne({
    where: { email: email },
  });

  if (emailInUse) {
    throw new CustomError('E-mail já cadastrado.', 409, 'E-mail informado já está em uso no sistema.');
  }

  const passwordValidationRe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;
  const passesTest = passwordValidationRe.test(String(password));
  if (!passesTest) {
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
