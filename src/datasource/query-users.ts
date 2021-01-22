import { User } from 'entity/user';
import { CustomError } from 'error/errors';
import { getRepository } from 'typeorm';

export const queryUsers = async (limit: number, offset: number) => {
  if (limit <= 0) {
    throw new CustomError('Limite inválido.', 400, 'Não é possível realizar a query com limite 0 ou negativo.');
  }

  if (offset < 0) {
    throw new CustomError('Offset inválido.', 400, 'Não é possível realizar a query com offset negativo.');
  }

  const count = await getRepository(User).count();

  const hasPreviousPage = offset === 0 ? false : true;
  const hasNextPage = offset + limit < count && limit != 0 ? true : false;

  const users = await getRepository(User).find({
    order: {
      name: 'ASC',
    },
    take: limit,
    skip: offset,
  });

  return { users, count, hasNextPage, hasPreviousPage };
};
