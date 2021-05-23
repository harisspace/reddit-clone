import request from "supertest";
import * as faker from "faker";
import { app } from "../server";

describe("POST /auth/register - a register endpoint", () => {
  test("must return user data", async () => {
    const endpoint = "/auth/register";

    const username = faker.name.findName();
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const password = faker.random.word();
    const email = faker.internet.email();

    const response = await request(app)
      .post(`${process.env.BASE_URL}${endpoint}`)
      .send({ username, first_name, last_name, password, email });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      username,
      first_name,
      last_name,
      email,
    });
  });

  test("must return bad request", async () => {
    const endpoint = "/auth/register";

    const username = faker.name.findName();
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const password = faker.random.word();
    const email = faker.address.city(); // invalid email

    const response = await request(app)
      .post(`${process.env.BASE_URL}${endpoint}`)
      .send({ username, first_name, last_name, password, email });
    expect(response.statusCode).toBe(400);
    console.log(response.body);
    expect(response.body.message).toEqual("Bad request input");
  });
});
