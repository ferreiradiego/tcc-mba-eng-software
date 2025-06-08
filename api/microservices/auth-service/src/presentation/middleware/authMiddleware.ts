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
    (req as any).user = {
      id: (payload as any).sub,
      role: (payload as any).role,
    };
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
}
