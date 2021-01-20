import { User } from 'entity/user';
import { addUserToDatabase, buildUserCreationMutation, buildUserQueryByIDMutation, getTokenByLogin } from 'test/helper';
import { getRepository } from 'typeorm';
import request from 'supertest';
import { expect } from 'chai';

let requestUrl: string;
let sampleUserId: number;

describe('User query by ID test', async () => {
  before(async () => {
    sampleUserId = await addUserToDatabase('rodrigo', 'rodrigo@email.com', '01-01-1997', '12312312312', 'senha');
    requestUrl = `http://localhost:${process.env.PORT}`;
  });

  after(async () => {
    await getRepository(User).clear();
  });

  it('Should retrieve a user from the database', async () => {
    const authToken = await getTokenByLogin(requestUrl);

    const userQueryByIDMutation = buildUserQueryByIDMutation(sampleUserId);
    const userQueryByIDResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(userQueryByIDMutation);

    expect(userQueryByIDResponse.body.data.user.user.id).to.equal(String(sampleUserId));
    expect(userQueryByIDResponse.body.data.user.user.name).to.equal('rodrigo');
    expect(userQueryByIDResponse.body.data.user.user.email).to.equal('rodrigo@email.com');
    expect(userQueryByIDResponse.body.data.user.user.birthDate).to.equal('01-01-1997');
    expect(userQueryByIDResponse.body.data.user.user.cpf).to.equal('12312312312');
  });

  it('Should return CustomError with message `JWT inválido.`', async () => {
    const userQueryByIDMutation = buildUserQueryByIDMutation(sampleUserId);
    const userQueryByIDResponse = await request(requestUrl).post('/graphql').send(userQueryByIDMutation);

    expect(userQueryByIDResponse.body.errors[0].message).to.equal('JWT inválido.');
    expect(userQueryByIDResponse.body.errors[0].httpCode).to.equal(401);
  });

  it('Should return CustomError with message `Usuário não encontrado.`', async () => {
    const authToken = await getTokenByLogin(requestUrl);

    const userQueryByIDMutation = buildUserQueryByIDMutation(sampleUserId + 1000);
    const userQueryByIDResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(userQueryByIDMutation);

    expect(userQueryByIDResponse.body.errors[0].message).to.equal('Usuário não encontrado.');
    expect(userQueryByIDResponse.body.errors[0].httpCode).to.equal(404);
  });
});
