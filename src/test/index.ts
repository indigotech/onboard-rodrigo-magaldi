import 'reflect-metadata';
import request from 'supertest';
import { setup } from 'setup-server';
import { expect } from 'chai';
import { createSampleUser, sampleLoginInput } from 'test/sample-data';
import { getRepository, Repository } from 'typeorm';
import { User } from 'entity/user';
import jwt from 'jsonwebtoken';

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
    await createSampleUser();
  });

  after(async () => {
    await userRepository.clear();
  });

  it('Should return user information upon login (with rememberMe)', async () => {
    const mutation = {
      query: `
      mutation{
        login(email: "${sampleLoginInput.email}", password: "${sampleLoginInput.password}", rememberMe: true){
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
        login(email: "${sampleLoginInput.email}", password: "${sampleLoginInput.password}"){
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
    expect(jwt.verify(response.body.data.login.token, process.env.JWT_SECRET)).to.not.throw;

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
