import { User } from 'entity/user';
import { CustomError } from 'error/errors';
import { getRepository } from 'typeorm';

export const queryUser = async (id: number) => {
  const user = await getRepository(User).findOne({
    where: { id: id },
  });

  if (!user) {
    throw new CustomError('Usuário não encontrado.', 404, 'ID fornecido não corresponde a nenhum usuário cadastrado.');
  }

  return { user };
};
