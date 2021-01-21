import { User } from 'entity/user';
import { getRepository } from 'typeorm';

export const queryUsers = async (limit: number, offset: number) => {
  const users = await getRepository(User).find({
    order: {
      name: 'ASC',
    },
    take: limit,
    skip: offset,
  });

  const count = await getRepository(User).count();

  const hasPreviousPage = offset === 0 ? false : true;
  const hasNextPage = offset + limit < count ? true : false;

  return { users, count, hasNextPage, hasPreviousPage };
};
