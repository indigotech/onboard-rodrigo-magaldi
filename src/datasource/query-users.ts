import { User } from 'entity/user';
import { getRepository } from 'typeorm';

export const queryUsers = (max: number) => {
  return getRepository(User).find({
    order: {
      name: 'ASC',
    },
    take: max,
  });
};
