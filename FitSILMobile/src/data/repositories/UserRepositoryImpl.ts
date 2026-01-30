import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserDataSource } from '../datasources/UserDataSource';
import { userMapper } from '../mappers/userMapper';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private dataSource: UserDataSource) {}

  async getProfile(email: string): Promise<User> {
    const dto = await this.dataSource.getProfile(email);
    return userMapper.toDomain(dto);
  }

  async updateProfile(email: string, data: Partial<User>): Promise<User> {
    const dto = await this.dataSource.updateProfile(email, userMapper.toDTO(data as User));
    return userMapper.toDomain(dto);
  }

  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    await this.dataSource.changePassword(email, currentPassword, newPassword);
  }
}