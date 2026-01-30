// src/presentation/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { AuthDataSource } from '../../data/datasources/AuthDataSource';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: number;
  nombre: string;
  apellido?: string;
  correo: string;
  rol: string;
  peso?: number;
  altura?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (correo: string, contrasenia: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
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

  // ✅ Función mejorada para validar usuario
  const isValidUser = (userData: User | null): boolean => {
    if (!userData) return false;
    
    // Verificar que tenga datos mínimos requeridos
    const hasValidData = 
      userData.id > 0 &&
      !!userData.nombre && 
      userData.nombre.trim() !== '' &&
      userData.nombre !== 'Usuario sin datos' &&
      !!userData.correo && 
      userData.correo.trim() !== '';
    
    return hasValidData;
  };

  // ✅ Cargar usuario al iniciar la app
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        
        // Verificar si hay token
        const token = await SecureStore.getItemAsync('userToken');
        
        if (!token) {
          console.log('❌ No hay token guardado');
          setUser(null);
          setLoading(false);
          return;
        }

        // Obtener datos del usuario guardados
        const userDataStr = await SecureStore.getItemAsync('userData');
        
        if (!userDataStr) {
          console.log('❌ No hay datos de usuario guardados');
          await SecureStore.deleteItemAsync('userToken');
          setUser(null);
          setLoading(false);
          return;
        }

        const userData = JSON.parse(userDataStr);
        
        // ✅ Validar que el usuario tenga datos completos
        if (!isValidUser(userData)) {
          console.log('❌ Usuario con datos inválidos, limpiando sesión');
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userData');
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('✅ Usuario válido cargado:', userData.nombre);
        setUser(userData);
        
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        // Limpiar todo en caso de error
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
      
      // ✅ Validar respuesta del backend
      if (!response || !response.token || !response.usuario) {
        throw new Error('Respuesta inválida del servidor');
      }

      const userData: User = {
        id: response.usuario.id,
        nombre: response.usuario.nombre,
        apellido: response.usuario.apellido,
        correo: response.usuario.correo,
        rol: response.usuario.rol || 'USUARIO',
        peso: response.usuario.peso,
        altura: response.usuario.altura,
      };

      // ✅ Validar antes de guardar
      if (!isValidUser(userData)) {
        throw new Error('Datos de usuario incompletos');
      }

      // Guardar token y datos
      await SecureStore.setItemAsync('userToken', response.token);
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      
      console.log('✅ Login exitoso:', userData.nombre);
      setUser(userData);
      
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      // Limpiar cualquier dato residual
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await authRepository.register(data);
      console.log('✅ Registro exitoso');
    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔓 Cerrando sesión...');
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: isValidUser(user),  // ✅ Validar antes de retornar
        loading,
        login,
        register,
        logout,
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