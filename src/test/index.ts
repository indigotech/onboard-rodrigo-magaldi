import 'reflect-metadata';
import request from 'supertest';
import { setup } from 'setup-server';
import { expect } from 'chai';
import { getRepository, Repository } from 'typeorm';
import { User } from 'entity/user';
import jwt from 'jsonwebtoken';
import { generateHash } from 'provider/hash-provider';

let userRepository: Repository<User>;
let requestUrl: string;

before(async () => {
  await setup();
  userRepository = getRepository(User);
  requestUrl = `http://localhost:${process.env.PORT}`;
});

describe('GraphQL sample query test', () => {
  it('Should return `Hello, world!`', async () => {
    const response = await request(requestUrl).post('/graphql').send({ query: '{ hello }' });
    expect(response.body.data.hello).to.equal('Hello, world!');
  });
});

describe('User mutation test', async () => {
  before(async () => {
    await addUserToDatabase('rodrigo', 'rodrigo@email.com', '01-01-1997', '12312312312', 'senha');
  });

  after(async () => {
    await userRepository.clear();
  });

  it('Should return user information upon login (with rememberMe)', async () => {
    const mutation = {
      query: `
      mutation{
        login(email: "rodrigo@email.com", password: "senha", rememberMe: true){
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

    const response = await request(requestUrl).post('/graphql').send(mutation);
    expect(response.body.data.login.user.name).to.equal('rodrigo');
    expect(response.body.data.login.user.email).to.equal('rodrigo@email.com');
    expect(response.body.data.login.user.birthDate).to.equal('01-01-1997');
    expect(response.body.data.login.user.cpf).to.equal('12312312312');
    expect(checkJWT(response.body.data.login.token, true)).to.equal(true);
  });

  it('Should return user information upon login (without rememberMe)', async () => {
    const mutation = {
      query: `
      mutation{
        login(email: "rodrigo@email.com", password: "senha"){
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

    const response = await request(requestUrl).post('/graphql').send(mutation);
    expect(response.body.data.login.user.name).to.equal('rodrigo');
    expect(response.body.data.login.user.email).to.equal('rodrigo@email.com');
    expect(response.body.data.login.user.birthDate).to.equal('01-01-1997');
    expect(response.body.data.login.user.cpf).to.equal('12312312312');
    expect(checkJWT(response.body.data.login.token, false)).to.equal(true);
  });
});

function checkJWT(token, rememberMe): boolean {
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (rememberMe) {
    return verified['iat'] === verified['exp'] - 604800;
  } else {
    return verified['iat'] === verified['exp'] - 3600;
  }
}

async function addUserToDatabase(name, email, birthDate, cpf, password) {
  const hashedPassword = await generateHash(password);
  const user = userRepository.create({
    name,
    email,
    birthDate,
    cpf,
    password: hashedPassword,
  });
  await userRepository.save(user);
}
