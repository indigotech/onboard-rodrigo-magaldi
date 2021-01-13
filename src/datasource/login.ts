import { getRepository } from "typeorm";
import { User } from "../entity/user";
import { LoginInterface } from "../graphql/interfaces";
import { HashProvider } from "../provider/hashProvider";


export const login = async ({email, password}: LoginInterface): Promise<User | undefined> => {
  const hashProvider = new HashProvider();

  const user = await getRepository(User).findOne({
    where: { email: email }
  });

  if (!user) {
    throw Error("Usuário não encontrado!")
  }

  const passwordMatched = await hashProvider.compareHash(password, user.password)

  if (!passwordMatched) {
    throw Error("Senha incorreta! Tente novamente.")
  }

  return user;
};
