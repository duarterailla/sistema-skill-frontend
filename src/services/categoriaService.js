<<<<<<< HEAD
import api from './api';

export const listarCategorias = async () => {
  const { data } = await api.get('/api/categorias');
  return data;
};

export const cadastrarCategoria = async (categoria) => {
  const { data } = await api.post('/api/categorias', categoria);
  return data;
};

export const atualizarCategoria = async (id, categoria) => {
  const { data } = await api.put(`/api/categorias/${id}`, categoria);
  return data;
=======
import api from './api';

export const listarCategorias = async () => {
  const { data } = await api.get('/api/categorias');
  return data;
};

export const cadastrarCategoria = async (categoria) => {
  const { data } = await api.post('/api/categorias', categoria);
  return data;
>>>>>>> 75b9b479a453719b25ebf1ec8155f7004fe16684
};