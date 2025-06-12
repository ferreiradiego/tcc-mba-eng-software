import { verifyToken } from "@infrastructure/auth/jwt";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido" });
  const [, token] = authHeader.split(" ");
  try {
    const payload = verifyToken(token);
    // TODO: Tipar req.user corretamente usando declaração de tipo global
    (req as any).user = {
      id: payload.sub,
      role: payload.role,
    };
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
}
