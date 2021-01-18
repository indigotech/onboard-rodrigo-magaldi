import { User } from 'entity/user';
import { generateHash } from 'provider/hash-provider';
import { getRepository } from 'typeorm';

export const sampleLoginInput = {
  name: 'rodrigo',
  email: 'rodrigo@email.com',
  birthDate: '01-01-1997',
  cpf: '12312312312',
  password: 'senha',
};

export const createSampleUser = async () => {
  const user = new User();
  user.name = sampleLoginInput.name;
  user.email = sampleLoginInput.email;
  user.birthDate = sampleLoginInput.birthDate;
  user.cpf = sampleLoginInput.cpf;
  user.password = await generateHash(sampleLoginInput.password);

  let userRepository = getRepository(User);
  await userRepository.save(user);
};
