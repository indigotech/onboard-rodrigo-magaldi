import jwt from 'jsonwebtoken';
import { expect } from 'chai';
import { generateHash } from 'provider/hash-provider';
import { getRepository } from 'typeorm';
import { User } from 'entity/user';
import request from 'supertest';

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
    mutation{
      login(email: "${email}", password: "${password}", rememberMe: ${rememberMe}){
        user{
          name
          email
          birthDate
          cpf
        },
        token
      }
    }
  `,
  };
}

export function buildUserCreationMutation(name, email, birthDate, cpf, password) {
  return {
    query: `
    mutation CreateUser {
      createUser (name: "${name}", email: "${email}", birthDate: "${birthDate}", cpf: "${cpf}", password: "${password}") {
        user {
          id
          name
          email
          birthDate
          cpf
        }
      }
    }
    `,
  };
}

export function buildUserQueryByIDMutation(id) {
  return {
    query: `
    query QueryUser {
      user (id: ${id}) {
        user {
          id
          name
          email
          birthDate
          cpf
        }
      }
    }
    `,
  };
}

export async function getTokenByLogin(requestUrl) {
  const loginMutation = buildLoginMutation('rodrigo@email.com', 'senha', false);
  const loginResponse = await request(requestUrl).post('/graphql').send(loginMutation);
  return loginResponse.body.data.login.token;
}
