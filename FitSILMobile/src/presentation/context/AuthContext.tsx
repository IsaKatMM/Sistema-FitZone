// src/presentation/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { AuthDataSource } from '../../data/datasources/AuthDataSource';
import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl';
import { UserDataSource } from '../../data/datasources/UserDataSource';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: number;
  nombre: string;
  apellido?: string;
  correo: string;
  usuario: string;
  telefono?: string;
  peso?: number;
  altura?: number;
  rol: "USUARIO" | "ADMINISTRADOR";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (correo: string, contrasenia: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (correo: string, data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  nombre: string;
  correo: string;
  contrasenia: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const authDataSource = new AuthDataSource();
  const authRepository = new AuthRepositoryImpl(authDataSource);
  
  const userDataSource = new UserDataSource();
  const userRepository = new UserRepositoryImpl(userDataSource);

  const isValidUser = (userData: User | null): boolean => {
    if (!userData) return false;
    
    const hasValidData = 
      userData.id > 0 &&
      !!userData.nombre && 
      userData.nombre.trim() !== '' &&
      userData.nombre !== 'Usuario sin datos' &&
      !!userData.correo && 
      userData.correo.trim() !== '';
    
    return hasValidData;
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        
        const token = await SecureStore.getItemAsync('userToken');
        
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const userDataStr = await SecureStore.getItemAsync('userData');
        
        if (!userDataStr) {
          await SecureStore.deleteItemAsync('userToken');
          setUser(null);
          setLoading(false);
          return;
        }

        const userData = JSON.parse(userDataStr);
        
        if (!isValidUser(userData)) {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userData');
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(userData);
        
      } catch (error) {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (correo: string, contrasenia: string) => {
    try {
      const response = await authRepository.login(correo, contrasenia);
      
      if (!response || !response.token || !response.usuario) {
        throw new Error('Respuesta inválida del servidor');
      }

      const userData: User = {
        id: response.usuario.id,
        nombre: response.usuario.nombre,
        apellido: response.usuario.apellido,
        correo: response.usuario.correo,
        usuario: response.usuario.usuario || response.usuario.correo,
        telefono: response.usuario.telefono,
        rol: response.usuario.rol || 'USUARIO',
        peso: response.usuario.peso,
        altura: response.usuario.altura,
      };

      if (!isValidUser(userData)) {
        throw new Error('Datos de usuario incompletos');
      }

      await SecureStore.setItemAsync('userToken', response.token);
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      
      setUser(userData);
      
    } catch (error: any) {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
      
      // Lanzar errores limpios sin logs
      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado. ¿Ya te has registrado?');
      } else if (error.response?.status === 403) {
        throw new Error('Acceso denegado. Tu cuenta puede estar inactiva.');
      } else if (error.response?.status === 500) {
        throw new Error('Error en el servidor. Inténtalo más tarde.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Error al iniciar sesión');
      }
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await authRepository.register(data);
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('El correo o usuario ya está registrado');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Datos inválidos. Verifica la información');
      } else if (error.response?.status === 500) {
        throw new Error('Error en el servidor. Inténtalo más tarde');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Error al registrar usuario');
      }
    }
  };

  const updateUser = async (correo: string, data: Partial<User>) => {
    try {
      const updatedUser = await userRepository.updateProfile(correo, data);
      
      const newUserData: User = {
        ...user!,
        ...updatedUser,
      };
      
      setUser(newUserData);
      await SecureStore.setItemAsync('userData', JSON.stringify(newUserData));
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado');
      } else if (error.response?.status === 400) {
        throw new Error('Datos inválidos. Verifica la información');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Error al actualizar usuario');
      }
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
    } catch (error) {
      // Silencioso - no mostrar error en logout
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: isValidUser(user),
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};