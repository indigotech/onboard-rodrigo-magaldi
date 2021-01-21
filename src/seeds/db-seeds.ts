import { User } from 'entity/user';
import { envConfig } from 'env-config';
import { name, internet, date } from 'faker';
import { generateHash } from 'provider/hash-provider';
import { connectToDatabase } from 'setup-server';
import { getRepository } from 'typeorm';

async function seedUsers() {
  envConfig();
  await connectToDatabase();
  const usersRepository = getRepository(User);

  const usersList = [];

  for (let i = 0; i < 50; i++) {
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
}

seedUsers();
