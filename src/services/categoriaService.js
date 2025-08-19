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
};