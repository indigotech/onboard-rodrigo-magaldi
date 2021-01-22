import { User } from 'entity/user';
import { envConfig } from 'env-config';
import { name, internet, date } from 'faker';
import { generateHash } from 'provider/hash-provider';
import { connectToDatabase } from 'setup-server';
import { getRepository } from 'typeorm';

export const seedUsers = async (numberOfUsers: number) => {
  const usersRepository = getRepository(User);

  const usersList = [];

  for (let i = 0; i < numberOfUsers; i++) {
    const hashedPassword = await generateHash('senha123');
    const user = {
      name: name.findName(),
      email: internet.email(),
      birthDate: date.past(),
      cpf: '12312312312',
      password: hashedPassword,
    };
    const newUser = usersRepository.create(user);
    usersList.push(newUser);
  }

  await usersRepository.save(usersList);
};

async function runSeed() {
  envConfig();
  await connectToDatabase();
  await seedUsers(2);
}

if (require.main === module) {
  runSeed();
}
