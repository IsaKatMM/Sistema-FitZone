import * as SecureStore from 'expo-secure-store';

const KEYS = {
  TOKEN: 'userToken',
  USER_DATA: 'userData',
  EMAIL: 'userEmail',
  ROL: 'userRol',
};

export const secureStorage = {
  // Token
  async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.TOKEN, token);
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(KEYS.TOKEN);
  },

  async deleteToken(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.TOKEN);
  },

  // User Data
  async saveUserData(data: any): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(data));
  },

  async getUserData(): Promise<any | null> {
    const data = await SecureStore.getItemAsync(KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  async deleteUserData(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.USER_DATA);
  },

  // Clear all
  async clearAll(): Promise<void> {
    await Promise.all([
      this.deleteToken(),
      this.deleteUserData(),
    ]);
  },
};