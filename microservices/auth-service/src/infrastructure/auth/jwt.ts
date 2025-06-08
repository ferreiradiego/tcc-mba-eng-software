import { User } from "@domain/entities/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const EXPIRES_IN = "1h";
const REFRESH_EXPIRES_IN = "7d";

export function generateToken(user: User) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });
}

export function generateRefreshToken(user: User) {
  return jwt.sign({ sub: user.id }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
