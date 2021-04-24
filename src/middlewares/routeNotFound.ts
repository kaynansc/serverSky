import { Request, Response, NextFunction } from "express";
import "express-async-errors";

export default function routeNotFound(
  request: Request,
  response: Response,
  next: NextFunction
): Response<void> {
  return response
    .status(404)
    .json({ mensagem: "Error 404 - Página não encontrada" });
}
