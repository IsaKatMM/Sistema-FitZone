// src/domain/usecases/user/UpdateProfileUseCase.ts
import { IUserRepository } from '../../repositories/IUserRepository';
import { User } from '../../entities/User';

export class UpdateProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, data: Partial<User>): Promise<User> {
    return await this.userRepository.updateProfile(email, data);
  }
}