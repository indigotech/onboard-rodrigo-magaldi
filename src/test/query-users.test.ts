import { User } from 'entity/user';
import { addUserToDatabase, buildUsersListQuery, checkUsers } from 'test/helper';
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

  it('Should retrieve users 1-10 from the database', async () => {
    const authToken = generateToken(sampleUserId, true);

    const usersListQuery = buildUsersListQuery(10, 0);
    const usersListQueryResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(usersListQuery);

    expect(usersListQueryResponse.body.data.users.count).to.equal(50);
    expect(usersListQueryResponse.body.data.users.hasNextPage).to.true;
    expect(usersListQueryResponse.body.data.users.hasPreviousPage).to.false;
    expect(usersListQueryResponse.body.data.users.users).to.have.lengthOf(10);

    checkUsers(usersListQueryResponse.body.data.users.users);
  });

  it('Should retrieve users 21-30 from the database', async () => {
    const authToken = generateToken(sampleUserId, true);

    const usersListQuery = buildUsersListQuery(10, 20);
    const usersListQueryResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(usersListQuery);

    expect(usersListQueryResponse.body.data.users.count).to.equal(50);
    expect(usersListQueryResponse.body.data.users.hasNextPage).to.true;
    expect(usersListQueryResponse.body.data.users.hasPreviousPage).to.true;
    expect(usersListQueryResponse.body.data.users.users).to.have.lengthOf(10);

    checkUsers(usersListQueryResponse.body.data.users.users);
  });

  it('Should skip all users and return empty data', async () => {
    const authToken = generateToken(sampleUserId, true);

    const usersListQuery = buildUsersListQuery(10, 50);
    const usersListQueryResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(usersListQuery);

    expect(usersListQueryResponse.body.data.users.count).to.equal(50);
    expect(usersListQueryResponse.body.data.users.hasNextPage).to.false;
    expect(usersListQueryResponse.body.data.users.hasPreviousPage).to.true;
    expect(usersListQueryResponse.body.data.users.users).to.be.deep.eq([]);
  });

  it('Should return CustomError with message `JWT inválido.`', async () => {
    const usersListQuery = buildUsersListQuery(10, 0);
    const usersListQueryResponse = await request(requestUrl).post('/graphql').send(usersListQuery);

    expect(usersListQueryResponse.body.errors[0].message).to.equal('JWT inválido.');
    expect(usersListQueryResponse.body.errors[0].httpCode).to.equal(401);
  });

  it('Should return CustomError with message `Limite inválido.` (limit zero)', async () => {
    const authToken = generateToken(sampleUserId, true);

    const usersListQuery = buildUsersListQuery(0, 0);
    const usersListQueryResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(usersListQuery);

    expect(usersListQueryResponse.body.errors[0].message).to.equal('Limite inválido.');
    expect(usersListQueryResponse.body.errors[0].httpCode).to.equal(400);
  });

  it('Should return CustomError with message `Limite inválido.` (negative limit)', async () => {
    const authToken = generateToken(sampleUserId, true);

    const usersListQuery = buildUsersListQuery(-1, 0);
    const usersListQueryResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(usersListQuery);

    expect(usersListQueryResponse.body.errors[0].message).to.equal('Limite inválido.');
    expect(usersListQueryResponse.body.errors[0].httpCode).to.equal(400);
  });

  it('Should return CustomError with message `Offset inválido.`', async () => {
    const authToken = generateToken(sampleUserId, true);

    const usersListQuery = buildUsersListQuery(10, -1);
    const usersListQueryResponse = await request(requestUrl)
      .post('/graphql')
      .set('Authorization', authToken)
      .send(usersListQuery);

    expect(usersListQueryResponse.body.errors[0].message).to.equal('Offset inválido.');
    expect(usersListQueryResponse.body.errors[0].httpCode).to.equal(400);
  });
});
