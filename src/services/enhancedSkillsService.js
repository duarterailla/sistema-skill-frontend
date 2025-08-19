import api from './api';
import * as skillsService from './skillsService';

export const enhancedSkillsService = {
  ...skillsService,
  
  addUserSkill: async (userId, skillId, level, descricao) => {
    if (!userId || !skillId || !level) {
      throw new Error('Parâmetros obrigatórios ausentes');
    }
    
    const response = await api.post('/api/user-skills', {
      userId: parseInt(userId),
      skillId: parseInt(skillId),
      level: level.trim(),
      descricao: descricao?.trim() || ''
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    return { success: true, data: response.data };
  },

  createNewSkill: async (skillData) => {
    const token = localStorage.getItem('token');
    const response = await api.post('/api/skills', skillData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  }
  ,
  updateSkill: async (skillId, skillData) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/api/skills/${skillId}`, skillData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
};