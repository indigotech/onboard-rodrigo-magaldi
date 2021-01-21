import jwt from 'jsonwebtoken';
import { expect } from 'chai';
import { generateHash } from 'provider/hash-provider';
import { getRepository } from 'typeorm';
import { User } from 'entity/user';

export function checkJWT(token, rememberMe) {
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  let expected: number;
  if (rememberMe) {
    expected = parseInt(process.env.JWT_REMEMBER_ME_EXPIRATION);
  } else {
    expected = parseInt(process.env.JWT_EXPIRATION);
  }
  expect(verified['iat']).to.equal(verified['exp'] - expected / 1000);
}

export async function addUserToDatabase(name, email, birthDate, cpf, password) {
  const hashedPassword = await generateHash(password);
  const user = getRepository(User).create({
    name,
    email,
    birthDate,
    cpf,
    password: hashedPassword,
  });
  await getRepository(User).save(user);
  return user.id;
}

export function buildLoginMutation(email, password, rememberMe) {
  return {
    query: `
    mutation Login($loginInput: LoginInput!) {
      login(loginInput: $loginInput){
        user{
          id
          name
          email
          birthDate
          cpf
        },
        token
      }
    }
  `,
    variables: {
      loginInput: {
        email,
        password,
        rememberMe,
      },
    },
  };
}

export function buildUserCreationMutation(name, email, birthDate, cpf, password) {
  return {
    query: `
    mutation CreateUser ($createUserInput: CreateUserInput!) {
      createUser (createUserInput: $createUserInput) {
        id
        name
        email
        birthDate
        cpf
      }
    }
    `,
    variables: {
      createUserInput: {
        name,
        email,
        birthDate,
        cpf,
        password,
      },
    },
  };
}

export function buildUserQueryByIDMutation(id) {
  return {
    query: `
    query QueryUser {
      user (id: ${id}) {
        id
        name
        email
        birthDate
        cpf
      }
    }
    `,
  };
}
