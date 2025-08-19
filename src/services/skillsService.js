import api from './api';

// Skills públicas (todas disponíveis)
export const getSkills = async () => {
  const { data } = await api.get('/api/skills');
  return data;
};

// Skills do usuário autenticado
export const getUserSkills = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token não encontrado. Faça login novamente.');
  return api.get(`/api/user-skills/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);
};

export const addUserSkill = async (userId, skillId, level) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/api/user-skills', { userId, skillId, level }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const updateUserSkill = async (userSkillId, level) => {
  await api.put(`/api/user-skills/${userSkillId}`, { level });
};

export const deleteUserSkill = async (userSkillId) => {
  await api.delete(`/api/user-skills/${userSkillId}`);
};
