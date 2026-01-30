import { User } from '../entities/User';

export interface LoginResponse {
  usuario: User;
  token: string;
  correo: string;
  rol: string;
  nombre: string;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<LoginResponse>;
  register(userData: Partial<User> & { contrasenia: string }): Promise<User>;
  logout(): Promise<void>;
}