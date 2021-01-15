import 'reflect-metadata';
import request from 'supertest';
import { setup } from 'setup-server';
import { expect } from 'chai';

describe('GraphQL sample query test', () => {
  before(async () => {
    await setup();
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
});
