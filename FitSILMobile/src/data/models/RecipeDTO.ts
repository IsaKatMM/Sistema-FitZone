// src/data/models/RecipeDTO.ts
export interface RecipeDTO {
  id: number;
  nombre: string;
  descripcion: string;
  categoria?: string;
  imagenUrl?: string;
  ingredientes?: string;
  instrucciones?: string;
  calorias?: number;
  proteinas?: number;
  carbohidratos?: number;
  grasas?: number;
  tiempoPreparacion?: number;
  dificultad?: string;
}