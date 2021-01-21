import { User } from 'entity/user';
import { getRepository } from 'typeorm';

export const queryUsers = (limit: number, offset: number) => {
  return getRepository(User).find({
    order: {
      name: 'ASC',
    },
    take: limit,
    skip: offset,
  });
};
