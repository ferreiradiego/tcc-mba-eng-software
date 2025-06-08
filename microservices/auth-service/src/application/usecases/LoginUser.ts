import { User } from "../../domain/entities/User";

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginUserResult {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginUser {
  execute(data: LoginUserDTO): Promise<LoginUserResult>;
}
