// src/domain/entities/Recipe.ts
export interface Recipe {
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