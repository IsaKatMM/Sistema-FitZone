const BASE_URL = "http://localhost:8081/ejercicios";

export async function obtenerEjercicios() {
  const res = await fetch(`${BASE_URL}/obtener`);
  if (!res.ok) throw new Error("Error al obtener ejercicios");
  return res.json();
}

export async function buscarEjercicio(nombre) {
  const res = await fetch(`${BASE_URL}/buscar?nombre=${encodeURIComponent(nombre)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al buscar ejercicio");
  return res.json();
}
