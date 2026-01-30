import { User } from '../entities/User';

export interface IUserRepository {
  getProfile(email: string): Promise<User>;
  updateProfile(email: string, data: Partial<User>): Promise<User>;
  changePassword(email: string, currentPassword: string, newPassword: string): Promise<void>;
}