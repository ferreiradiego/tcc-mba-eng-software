// src/domain/entities/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}
