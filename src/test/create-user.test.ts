import { User } from 'entity/user';
import { addUserToDatabase, buildUserCreationMutation, getTokenByLogin } from 'test/helper';
import { getRepository } from 'typeorm';
import request from 'supertest';
import { expect } from 'chai';

let requestUrl: string;

describe('User creation mutation test', async () => {
  before(async () => {
    await addUserToDatabase('rodrigo', 'rodrigo@email.com', '01-01-1997', '12312312312', 'senha');
    requestUrl = `http://localhost:${process.env.PORT}`;
  });

  after(async () => {
    await getRepository(User).clear();
  });

  it('Should create a new user in the database', async () => {
    const authToken = await getTokenByLogin(requestUrl);

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

    const addedUser = await getRepository(User).findOne({
      where: { email: 'rafael@email.com' },
    });

    expect(addedUser.name).to.equal('rafael');
    expect(addedUser.email).to.equal('rafael@email.com');
    expect(addedUser.birthDate).to.equal('04-02-1995');
    expect(addedUser.cpf).to.equal('12345678910');

    const numOfRows = await getRepository(User).count();
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
    const authToken = await getTokenByLogin(requestUrl);

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
    const authToken = await getTokenByLogin(requestUrl);

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
