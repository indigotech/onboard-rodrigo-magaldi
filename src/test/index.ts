import 'reflect-metadata';
import request from 'supertest';
import { setup } from 'setup-server';
import { expect } from 'chai';
import { execute } from 'test/sample-data';

describe('GraphQL sample query test', () => {
  before(async () => {
    await setup();
    execute();
  });

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

  it('Should return user information upon login'), (done) => {};
});

// connect test db and server
// create sample data in database
// create sample input
// run test
// check for the correct response
// check db after testing
// clear db
