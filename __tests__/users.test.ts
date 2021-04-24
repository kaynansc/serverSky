/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
import bcrypt from "bcrypt";
import request from "supertest";
import { v4 as uuid } from "uuid";

import app from "../src/App";
import AuthController from "../src/controller/AuthController";
import { Users } from "../src/model/Users";
import dbHandler from "./db-handler";

beforeAll(async () => {
  try {
    await dbHandler.connect();
  } catch (err) {
    console.log(err);
  }
});

afterEach(async () => {
  try {
    await dbHandler.clearDatabase();
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  try {
    await dbHandler.closeDatabase();
  } catch (err) {
    console.log(err);
  }
});

describe("User", () => {
  it("should encrypt user password", async () => {
    const user = await Users.create({
      id: uuid(),
      nome: "Kaynan Sampaio",
      email: "kaynansc@gmail.com",
      senha: "123",
      telefones: [{ numero: "99999999", ddd: "015" }],
    });

    const compareHash = await bcrypt.compare("123", user.senha);

    expect(compareHash).toBe(true);
  });

  it("should authenticated with valid credentials", async () => {
    const user = await Users.create({
      id: uuid(),
      nome: "Kaynan Sampaio",
      email: "kaynansc@gmail.com",
      senha: "123",
      telefones: [{ numero: "99999999", ddd: "015" }],
    });

    const response = await request(app).post("/user/signin").send({
      email: user.email,
      senha: "123",
    });

    expect(response.status).toBe(200);
  });

  it("should not authenticate with invalid password", async () => {
    const user = await Users.create({
      id: uuid(),
      nome: "Kaynan Sampaio",
      email: "kaynansc@gmail.com",
      senha: "123",
      telefones: [{ numero: "99999999", ddd: "015" }],
    });

    const response = await request(app).post("/user/signin").send({
      email: user.email,
      senha: "123456",
    });

    expect(response.status).toBe(401);
  });

  it("should not authenticate with invalid email", async () => {
    await Users.create({
      id: uuid(),
      nome: "Kaynan Sampaio",
      email: "kaynansc@gmail.com",
      senha: "123",
      telefones: [{ numero: "99999999", ddd: "015" }],
    });

    const response = await request(app).post("/user/signin").send({
      email: "teste@gmail.com.br",
      senha: "123",
    });

    expect(response.status).toBe(401);
  });

  it("should return jwt token when authenticated", async () => {
    const user = await Users.create({
      id: uuid(),
      nome: "Kaynan Sampaio",
      email: "kaynansc@gmail.com",
      senha: "123",
      telefones: [{ numero: "99999999", ddd: "015" }],
    });

    const response = await request(app).post("/user/signin").send({
      email: user.email,
      senha: "123",
    });

    expect(response.body).toHaveProperty("token");
  });

  it("should be able to acess route list user when authenticated", async () => {
    const user = await Users.create({
      id: uuid(),
      nome: "Kaynan Sampaio",
      email: "kaynansc@gmail.com",
      senha: "123",
      telefones: [{ numero: "99999999", ddd: "015" }],
    });

    const response = await request(app)
      .get(`/user/${user.id}`)
      .set("Authorization", `Bearer ${AuthController.generateToken(user.id)}`);

    expect(response.status).toBe(200);
  });

  it("should be able to acess route list user when authenticated", async () => {
    const user = await Users.create({
      id: uuid(),
      nome: "Kaynan Sampaio",
      email: "kaynansc@gmail.com",
      senha: "123",
      telefones: [{ numero: "99999999", ddd: "015" }],
    });

    const response = await request(app)
      .get(`/user/${user.id}`)
      .set("Authorization", `Bearer ${AuthController.generateToken(user.id)}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to acess route list user when not authenticated", async () => {
    const user = await Users.create({
      id: uuid(),
      nome: "Kaynan Sampaio",
      email: "kaynansc@gmail.com",
      senha: "123",
      telefones: [{ numero: "99999999", ddd: "015" }],
    });

    const response = await request(app)
      .get(`/user/${user.id}`)
      .set("Authorization", `Bearer testebearer`);

    expect(response.status).toBe(401);
  });
});
