import { User } from "entity/user";
import { getRepository } from "typeorm";
import { LoginInterface } from "graphql/interfaces";
import { compareHash, generateHash } from "provider/hash-provider";

export const login = async ({email, password}: LoginInterface): Promise<User | undefined> => {

  const user = await getRepository(User).findOne({
    where: { email: email }
  });

  if (!user) {
    throw Error("Credenciais inválidas.")
  }

  const passwordMatched = await compareHash(password, user.password)

  if (!passwordMatched) {
    throw Error("Credenciais inválidas.")
  }

  return user;
};
