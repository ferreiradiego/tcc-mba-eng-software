import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import {
  generateToken,
  generateRefreshToken,
} from "../../infrastructure/auth/jwt";
import { RegisterUserSchema } from "../../application/usecases/RegisterUser";

const userRepository = new PrismaUserRepository();

export async function registerController(req: Request, res: Response) {
  const parse = RegisterUserSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
  }
  const { name, email, password, role } = parse.data;
  const existing = await userRepository.findByEmail(email);
  if (existing) return res.status(409).json({ message: "Email já cadastrado" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.create({
    name,
    email,
    passwordHash,
    role: role || "USER",
  });
  res
    .status(201)
    .json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await userRepository.findByEmail(email);
  if (!user) return res.status(401).json({ message: "Credenciais inválidas" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Credenciais inválidas" });
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({
    token,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

export async function refreshController(req: Request, res: Response) {
  // Implementação simplificada: espera refreshToken no body
  const { refreshToken } = req.body;
  try {
    const payload = require("jsonwebtoken").verify(
      refreshToken,
      process.env.JWT_SECRET || "default_secret"
    );
    const user = await userRepository.findById(payload.sub);
    if (!user)
      return res.status(401).json({ message: "Usuário não encontrado" });
    const token = generateToken(user);
    res.json({ token });
  } catch {
    res.status(401).json({ message: "Refresh token inválido" });
  }
}

export async function meController(req: Request, res: Response) {
  // Espera req.user.id preenchido por middleware de autenticação
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ message: "Não autenticado" });
  const user = await userRepository.findById(userId);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
