import { User } from 'entity/user';
import { addUserToDatabase, buildUsersListQuery } from 'test/helper';
import { getRepository } from 'typeorm';
import request from 'supertest';
import { expect, Assertion } from 'chai';
import { generateToken } from 'provider/token-provider';
import { seedUsers } from 'seeds/db-seeds';

let requestUrl: string;
let sampleUserId: number;

describe('Users list query test', async () => {
  before(async () => {
    sampleUserId = await addUserToDatabase('rodrigo', 'rodrigo@email.com', '01-01-1997', '12312312312', 'senha');
    await seedUsers(49);
    requestUrl = `http://localhost:${process.env.PORT}`;
  });

  after(async () => {
    await getRepository(User).clear();
  });

  it('Should retrieve all users from the database', async () => {
    const authToken = generateToken(sampleUserId, true);

    const usersListQuery = buildUsersListQuery(0, 0);
    const usersListQueryResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(usersListQuery);

    expect(usersListQueryResponse.body.data.users.count).to.equal(50);
    expect(usersListQueryResponse.body.data.users.hasNextPage).to.equal(false);
    expect(usersListQueryResponse.body.data.users.hasPreviousPage).to.equal(false);

    // insufficent validation. still needs improvement
    expect(usersListQueryResponse.body.data.users.users[0]).to.have.all.keys('id', 'name', 'email', 'birthDate', 'cpf');
  });

  // it('Should return CustomError with message `JWT inválido.`', async () => {
  //   const userQueryByIDMutation = buildUserQueryByIDMutation(sampleUserId);
  //   const userQueryByIDResponse = await request(requestUrl).post('/graphql').send(userQueryByIDMutation);

  //   expect(userQueryByIDResponse.body.errors[0].message).to.equal('JWT inválido.');
  //   expect(userQueryByIDResponse.body.errors[0].httpCode).to.equal(401);
  // });

  // it('Should return CustomError with message `Usuário não encontrado.`', async () => {
  //   const authToken = generateToken(sampleUserId, true);

  //   const userQueryByIDMutation = buildUserQueryByIDMutation(sampleUserId + 1000);
  //   const userQueryByIDResponse = await request(requestUrl)
  //     .post('/graphql')
  //     .set('Authorization', authToken)
  //     .send(userQueryByIDMutation);

  //   expect(userQueryByIDResponse.body.errors[0].message).to.equal('Usuário não encontrado.');
  //   expect(userQueryByIDResponse.body.errors[0].httpCode).to.equal(404);
  // });
});
