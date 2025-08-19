import api from './api';

// Serviço de autenticação
export const login = async (login, password) => {
  try {
    const response = await api.post('/api/auth/login', { login, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId); // ajuste conforme resposta do backend
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Erro ao logar' };
  }
};

export const cadastrar = async (data) => {
  try {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Erro ao cadastrar' };
  }
};
