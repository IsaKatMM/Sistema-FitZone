import { Recipe } from '../../domain/entities/Recipe';
import { RecipeDTO } from '../models/RecipeDTO';

export const recipeMapper = {
  toDomain(dto: RecipeDTO): Recipe {
    return {
      id: dto.id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      imagenUrl: dto.imagenUrl,
      ingredientes: dto.ingredientes,
      instrucciones: dto.instrucciones,
    };
  },

  toDomainList(dtos: RecipeDTO[]): Recipe[] {
    return dtos.map(this.toDomain);
  },
};