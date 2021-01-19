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

describe('Login mutation test', async () => {
  before(async () => {
    await addUserToDatabase('rodrigo', 'rodrigo@email.com', '01-01-1997', '12312312312', 'senha');
  });

  after(async () => {
    await userRepository.clear();
  });

  it('Should return user information upon login (with rememberMe)', async () => {
    const mutation = buildLoginMutation('rodrigo@email.com', 'senha', true);
    const response = await request(requestUrl).post('/graphql').send(mutation);
    expect(response.body.data.login.user.name).to.equal('rodrigo');
    expect(response.body.data.login.user.email).to.equal('rodrigo@email.com');
    expect(response.body.data.login.user.birthDate).to.equal('01-01-1997');
    expect(response.body.data.login.user.cpf).to.equal('12312312312');
    checkJWT(response.body.data.login.token, true);
  });

  it('Should return user information upon login (without rememberMe)', async () => {
    const mutation = buildLoginMutation('rodrigo@email.com', 'senha', false);
    const response = await request(requestUrl).post('/graphql').send(mutation);
    expect(response.body.data.login.user.name).to.equal('rodrigo');
    expect(response.body.data.login.user.email).to.equal('rodrigo@email.com');
    expect(response.body.data.login.user.birthDate).to.equal('01-01-1997');
    expect(response.body.data.login.user.cpf).to.equal('12312312312');
    checkJWT(response.body.data.login.token, false);
  });

  it('Should return CustomError with message `E-mail inválido` (email not found)', async () => {
    const mutation = buildLoginMutation('notanemail', 'senha', false);
    const response = await request(requestUrl).post('/graphql').send(mutation);
    expect(response.body.errors[0].message).to.equal('E-mail inválido.');
    expect(response.body.errors[0].httpCode).to.equal(400);
  });

  it('Should return CustomError with message `Credenciais inválidas` (email not found)', async () => {
    const mutation = buildLoginMutation('wrong@email.com', 'senha', false);
    const response = await request(requestUrl).post('/graphql').send(mutation);
    expect(response.body.errors[0].message).to.equal('Credenciais inválidas.');
    expect(response.body.errors[0].httpCode).to.equal(401);
  });

  it('Should return CustomError with message `Credenciais inválidas` (wrong password)', async () => {
    const mutation = buildLoginMutation('rodrigo@email.com', 'wrong', false);
    const response = await request(requestUrl).post('/graphql').send(mutation);
    expect(response.body.errors[0].message).to.equal('Credenciais inválidas.');
    expect(response.body.errors[0].httpCode).to.equal(401);
  });
});

describe('User creation mutation test', async () => {
  before(async () => {
    await addUserToDatabase('rodrigo', 'rodrigo@email.com', '01-01-1997', '12312312312', 'senha');
  });

  after(async () => {
    await userRepository.clear();
  });

  it('Should create a new user in the database', async () => {
    const authToken = await loginBeforeCreatingUser();

    const userCreationMutation = buildUserCreationMutation(
      'rafael',
      'rafael@email.com',
      '04-02-1995',
      '12345678910',
      'senha123',
    );
    const userCreationResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(userCreationMutation);

    expect(userCreationResponse.body.data.createUser.user.name).to.equal('rafael');
    expect(userCreationResponse.body.data.createUser.user.email).to.equal('rafael@email.com');
    expect(userCreationResponse.body.data.createUser.user.birthDate).to.equal('04-02-1995');
    expect(userCreationResponse.body.data.createUser.user.cpf).to.equal('12345678910');

    const addedUser = await userRepository.findOne({
      where: { email: 'rafael@email.com' },
    });

    expect(addedUser.name).to.equal('rafael');
    expect(addedUser.email).to.equal('rafael@email.com');
    expect(addedUser.birthDate).to.equal('04-02-1995');
    expect(addedUser.cpf).to.equal('12345678910');

    const numOfRows = await userRepository.count();
    expect(numOfRows).to.equal(2);
  });

  it('Should return CustomError with message `JWT inválido.`', async () => {
    const userCreationMutation = buildUserCreationMutation(
      'rafael',
      'rafael@email.com',
      '04-02-1995',
      '12345678910',
      'senha123',
    );
    const userCreationResponse = await request(requestUrl).post('/graphql').send(userCreationMutation);

    expect(userCreationResponse.body.errors[0].message).to.equal('JWT inválido.');
    expect(userCreationResponse.body.errors[0].httpCode).to.equal(401);
  });

  it('Should return CustomError with message `E-mail já cadastrado.`', async () => {
    const authToken = await loginBeforeCreatingUser();

    const userCreationMutation = buildUserCreationMutation(
      'nome',
      'rodrigo@email.com',
      '01-01-1999',
      '32132132132',
      'senha123',
    );
    const userCreationResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(userCreationMutation);

    expect(userCreationResponse.body.errors[0].message).to.equal('E-mail já cadastrado.');
    expect(userCreationResponse.body.errors[0].httpCode).to.equal(409);
  });

  it('Should return CustomError with message `Senha inadequada.`', async () => {
    const authToken = await loginBeforeCreatingUser();

    const userCreationMutation = buildUserCreationMutation(
      'nome',
      'novo@email.com',
      '01-01-1999',
      '32132132132',
      'senha1',
    );
    const userCreationResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(userCreationMutation);

    expect(userCreationResponse.body.errors[0].message).to.equal('Senha inadequada.');
    expect(userCreationResponse.body.errors[0].httpCode).to.equal(403);
  });
});

function checkJWT(token, rememberMe) {
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  let expected: number;
  if (rememberMe) {
    expected = parseInt(process.env.JWT_REMEMBER_ME_EXPIRATION);
  } else {
    expected = parseInt(process.env.JWT_EXPIRATION);
  }
  expect(verified['iat']).to.equal(verified['exp'] - expected / 1000);
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

function buildLoginMutation(email, password, rememberMe) {
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

function buildUserCreationMutation(name, email, birthDate, cpf, password) {
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

async function loginBeforeCreatingUser() {
  const loginMutation = buildLoginMutation('rodrigo@email.com', 'senha', false);
  const loginResponse = await request(requestUrl).post('/graphql').send(loginMutation);
  return loginResponse.body.data.login.token;
}
