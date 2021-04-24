import { Request, Response, NextFunction } from "express";
import "express-async-errors";

import AppError from "../errors/AppError";

export default function returnResponseError(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
): Response<void> {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      mensagem: err.message,
    });
  }

  return response.status(500).json({
    mensagem: "Erro interno no servidor!",
  });
}
