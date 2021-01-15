import request from "supertest";
import { setupServer } from "server";
import { expect } from 'chai';

before(async () => {
  setupServer();
})

describe("GraphQL sample query test", () => {
  it("Should return `Hello, world!`", (done) => {
    request("http://localhost:3030")
      .post("/graphql")
      .send({ query: '{ hello }' })
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        expect(res.body.data.hello).to.equal("Hello, world!")
        done();
      })
  })
})
