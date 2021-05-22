import request from "supertest";
import * as faker from "faker";
import { app } from "../server";

describe("POST /auth/register - a register endpoint", () => {
  test("must return user data", (done) => {
    const username = faker.name.findName();
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const password = faker.random.word();
    const email = faker.internet.email();

    request(app)
      .post(`/api/v1/auth/register`)
      .send({
        username,
        first_name,
        last_name,
        password,
        email,
      })
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body).toBeTruthy();
        done();
      })
      .catch((err) => done(err));
  });
});
