import { IAuthRepository } from '../../repositories/IAuthRepository';
import { User } from '../../entities/User';

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userData: Partial<User> & { contrasenia: string }): Promise<User> {
    // Validaciones
    if (!userData.nombre || userData.nombre.length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }

    if (!userData.correo || !userData.correo.includes('@')) {
      throw new Error('Email inválido');
    }

    if (!userData.usuario || userData.usuario.length < 3) {
      throw new Error('El usuario debe tener al menos 3 caracteres');
    }

    if (!userData.contrasenia || userData.contrasenia.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    return await this.authRepository.register(userData);
  }
}