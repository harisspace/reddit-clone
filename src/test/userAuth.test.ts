import request from "supertest";
import authController, { User } from "../controllers/authController";
import { prisma } from "../server";
import * as faker from "faker";
import { app } from "../server";

const BASE_URL = "http://localhost:4000";

describe("POST /auth/register - a register endpoint", () => {
  test("must return user data", async () => {
    const data = await request(app)
      .post(`${BASE_URL}/auth/register`)
      .send({
        username: faker.name.findName(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        password: faker.random.word(),
        email: faker.internet.email(),
      })
      .expect(200);
    console.log(data);
  });
});
