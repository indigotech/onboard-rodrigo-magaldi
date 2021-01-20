import { addUserToDatabase, checkJWT, buildLoginMutation } from 'test/helper';
import request from 'supertest';
import { expect } from 'chai';
import { getRepository } from 'typeorm';
import { User } from 'entity/user';

let requestUrl: string;

describe('Login mutation test', async () => {
  before(async () => {
    await addUserToDatabase('rodrigo', 'rodrigo@email.com', '01-01-1997', '12312312312', 'senha');
    requestUrl = `http://localhost:${process.env.PORT}`;
  });

  after(async () => {
    await getRepository(User).clear();
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
