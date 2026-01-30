import { User } from '../../domain/entities/User';
import { UserDTO } from '../models/UserDTO';

export const userMapper = {
  toDomain(dto: UserDTO): User {
    return {
      id: dto.id,
      nombre: dto.nombre,
      apellido: dto.apellido,
      correo: dto.correo,
      usuario: dto.usuario,
      telefono: dto.telefono,
      peso: dto.peso,
      altura: dto.altura,
      rol: dto.rol as 'USUARIO' | 'ADMINISTRADOR',
    };
  },

  toDTO(domain: User): UserDTO {
    return {
      id: domain.id,
      nombre: domain.nombre,
      apellido: domain.apellido,
      correo: domain.correo,
      usuario: domain.usuario,
      telefono: domain.telefono,
      peso: domain.peso,
      altura: domain.altura,
      rol: domain.rol,
    };
  },
};