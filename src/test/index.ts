import "reflect-metadata";
import request from "supertest";
import { setup } from "setup-server";
import { expect } from 'chai';

before(async () => {
  await setup();
})

describe("GraphQL sample query test", () => {
  it("Should return `Hello, world!`", (done) => {
    request("http://localhost:4000")
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
