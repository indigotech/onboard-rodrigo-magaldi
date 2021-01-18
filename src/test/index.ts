import 'reflect-metadata';
import request from 'supertest';
import { setup } from 'setup-server';
import { expect } from 'chai';
import { createSampleUser, sampleLoginInput } from 'test/sample-data';
import { getRepository, Repository } from 'typeorm';
import { User } from 'entity/user';
import jwt from 'jsonwebtoken';

let userRepository: Repository<User>;

before(async () => {
  await setup();
});

describe('GraphQL sample query test', () => {
  it('Should return `Hello, world!`', (done) => {
    request(`http://localhost:${process.env.PORT}`)
      .post('/graphql')
      .send({ query: '{ hello }' })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data.hello).to.equal('Hello, world!');
        done();
      });
  });
});

describe('User mutation test', async () => {
  before(async () => {
    await createSampleUser();
  });

  after(async () => {
    userRepository = getRepository(User);
    await userRepository.clear();
  });

  it('Should return user information upon login', (done) => {
    const mutation = {
      query: `mutation{
      login(email: "${sampleLoginInput.email}", password: "${sampleLoginInput.password}", rememberMe: true){
        user{
          name
        },
        token
      }
    }`,
    };

    request(`http://localhost:${process.env.PORT}`)
      .post('/graphql')
      .send(mutation)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data.login.user.name).to.equal('rodrigo');
        expect(jwt.verify(res.body.data.login.token, process.env.JWT_SECRET)).to.not.throw;

        done();
      });
  });
});
