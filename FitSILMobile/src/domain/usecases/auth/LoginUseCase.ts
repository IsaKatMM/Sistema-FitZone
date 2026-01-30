import { IAuthRepository, LoginResponse } from '../../repositories/IAuthRepository';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    return await this.authRepository.login(email, password);
  }
}