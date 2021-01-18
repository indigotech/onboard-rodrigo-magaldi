import { User } from 'entity/user';
import { generateHash } from 'provider/hash-provider';
import { getRepository } from 'typeorm';

export const execute = async () => {
  const user = new User();
  user.name = 'rodrigo';
  user.email = 'rodrigo@email.com';
  user.birthDate = '01-01-1997';
  user.cpf = '12312312312';
  user.password = await generateHash('senha');

  let userRepository = getRepository(User);
  await userRepository.save(user);
  console.log('Sample user saved to database');
};
