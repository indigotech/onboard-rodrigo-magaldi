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

    expect(usersListQueryResponse.body.data.users.users[0]).to.have.all.keys('id', 'name', 'email', 'birthDate', 'cpf');
    expect(usersListQueryResponse.body.data.users.users[0].id).to.be.a('string');
    expect(usersListQueryResponse.body.data.users.users[0].name).to.be.a('string');
    expect(usersListQueryResponse.body.data.users.users[0].email).to.be.a('string');
    expect(usersListQueryResponse.body.data.users.users[0].birthDate).to.be.a('string');
    expect(usersListQueryResponse.body.data.users.users[0].cpf).to.be.a('string');
  });

  it('Should return CustomError with message `JWT inválido.`', async () => {
    const usersListQuery = buildUsersListQuery(0, 0);
    const usersListQueryResponse = await request(requestUrl).post('/graphql').send(usersListQuery);

    expect(usersListQueryResponse.body.errors[0].message).to.equal('JWT inválido.');
    expect(usersListQueryResponse.body.errors[0].httpCode).to.equal(401);
  });

  it('Should skip all users and return empty data', async () => {
    const authToken = generateToken(sampleUserId, true);

    const usersListQuery = buildUsersListQuery(0, 50);
    const usersListQueryResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(usersListQuery);

    expect(usersListQueryResponse.body.data.users.count).to.equal(50);
    expect(usersListQueryResponse.body.data.users.hasNextPage).to.equal(false);
    expect(usersListQueryResponse.body.data.users.hasPreviousPage).to.equal(true);
    expect(usersListQueryResponse.body.data.users.users).to.be.empty;
  });
});
