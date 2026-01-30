import { apiClient } from '../../core/api/apiClient';
import { ENDPOINTS } from '../../core/api/endpoints';

export class AuthDataSource {
  async login(email: string, password: string): Promise<any> {
    return await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
      correo: email,
      contrasenia: password,
    });
  }

  async register(userData: any): Promise<any> {
    return await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
  }
}