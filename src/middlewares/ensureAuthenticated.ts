import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import authConfig from "../config/auth";
import AppError from "../errors/AppError";

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Não autorizado", 401);
  }

  const [, token] = authHeader.split(" ");
  try {
    verify(token, authConfig.jwt.secret);

    return next();
  } catch (err) {
    throw new AppError("Sessão Inválida", 401);
  }
}
