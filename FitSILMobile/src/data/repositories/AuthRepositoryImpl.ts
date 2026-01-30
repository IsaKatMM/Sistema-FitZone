import { IAuthRepository, LoginResponse } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { AuthDataSource } from '../datasources/AuthDataSource';
import { userMapper } from '../mappers/userMapper';
import { secureStorage } from '../../core/storage/secureStorage';

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(private dataSource: AuthDataSource) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.dataSource.login(email, password);
    
    // Guardar token y datos del usuario
    await secureStorage.saveToken(response.token);
    await secureStorage.saveUserData({
      email: response.correo,
      rol: response.rol,
      nombre: response.nombre,
    });

    return {
      usuario: userMapper.toDomain(response.usuario),
      token: response.token,
      correo: response.correo,
      rol: response.rol,
      nombre: response.nombre,
    };
  }

  async register(userData: Partial<User> & { contrasenia: string }): Promise<User> {
    const response = await this.dataSource.register(userData);
    return userMapper.toDomain(response);
  }

  async logout(): Promise<void> {
    await secureStorage.clearAll();
  }
}