import { apiClient } from '../../core/api/apiClient';
import { ENDPOINTS } from '../../core/api/endpoints';
import { UserDTO } from '../models/UserDTO';

export class UserDataSource {
  async getProfile(email: string): Promise<UserDTO> {
    return await apiClient.get(ENDPOINTS.USER.PROFILE(email));
  }

  async updateProfile(email: string, data: Partial<UserDTO>): Promise<UserDTO> {
    return await apiClient.put(`${ENDPOINTS.USER.UPDATE}?email=${email}`, data);
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.put(`${ENDPOINTS.USER.CHANGE_PASSWORD}?email=${email}`, {
      contrasenaActual: currentPassword,
      contrasenaNueva: newPassword,
    });
  }
}