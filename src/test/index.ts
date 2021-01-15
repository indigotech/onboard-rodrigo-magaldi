import request from "supertest";
import assert from "assert";
import { setupServer } from "server";

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
        assert.strictEqual(res.body.data.hello, "Hello, world!")
        done();
      })
  })
})
