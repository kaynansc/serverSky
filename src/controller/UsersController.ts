import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

import AppError from "../errors/AppError";
import { IUser, Users } from "../model/Users";
import AuthController from "./AuthController";

class UsersController {
  async signUp(request: Request, response: Response): Promise<Response> {
    const { nome, email, senha, telefones } = request.body;

    const userByEmail: IUser = await Users.findOne({ email });

    if (userByEmail) {
      throw new AppError("E-mail já existente.", 409);
    }

    try {
      const User: IUser = await Users.create({
        id: uuid(),
        nome,
        email,
        senha,
        telefones,
        data_criacao: new Date(),
        data_atualizacao: new Date(),
        ultimo_login: new Date(),
      });

      const token = AuthController.generateToken(User.id);

      const userResponse = {
        id: User.id,
        data_criacao: User.data_criacao,
        data_atualizacao: User.data_atualizacao,
        ultimo_login: User.ultimo_login,
        token,
      };

      return response.status(200).json(userResponse);
    } catch (err) {
      throw new AppError("Falha ao criar o usuário!", 400);
    }
  }

  async signIn(request: Request, response: Response): Promise<Response> {
    const { email, senha } = request.body;

    const userByEmail: IUser = await Users.findOne({ email });

    if (!userByEmail) {
      throw new AppError("Usuário e/ou senha inválidos", 401);
    }

    const passwordMatched = AuthController.comparePassword(
      senha,
      userByEmail.senha
    );

    if (!passwordMatched) {
      throw new AppError("Usuário e/ou senha inválidos", 401);
    }

    const updatedDate = new Date();

    await userByEmail.updateOne({
      ultimo_login: updatedDate,
    });

    const token = AuthController.generateToken(userByEmail.id);

    const userResponse = {
      id: userByEmail.id,
      data_criacao: userByEmail.data_criacao,
      data_atualizacao: userByEmail.data_atualizacao,
      ultimo_login: updatedDate,
      token,
    };

    return response.status(200).json(userResponse);
  }

  async getUser(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const user: IUser = await Users.findOne({ id });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return response.status(200).json(user);
  }
}

export default new UsersController();
