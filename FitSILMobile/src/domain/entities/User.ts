export interface User {
  id: number;
  nombre: string;
  apellido?: string;
  correo: string;
  usuario: string;
  telefono?: string;
  peso?: number;
  altura?: number;
  rol: 'USUARIO' | 'ADMINISTRADOR';
}