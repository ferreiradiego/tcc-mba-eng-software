import { Request, Response, NextFunction } from "express";
import axios from "axios";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }
  const [, token] = authHeader.split(" ");
  try {
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL || "http://localhost:3001"}/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    (req as any).user = response.data;
    next();
  } catch (err: any) {
    return res
      .status(401)
      .json({ message: "Token inválido ou usuário não autenticado" });
  }
}
