import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { enhancedSkillsService } from '../services/enhancedSkillsService';
import { MESSAGES } from '../constants/skillConstants';

export const useSkillsManagement = () => {
  const navigate = useNavigate();
  const [userSkills, setUserSkills] = useState([]);
  const [editLevel, setEditLevel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Auto-clear messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userId) navigate('/login');
  }, [userId, navigate]);

  // Fetch skills data
  const fetchSkillsData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    if (!token) {
      setError(MESSAGES.sessionExpired);
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const userSkillsData = await enhancedSkillsService.getUserSkills(userId);
      setUserSkills(userSkillsData);
    } catch (err) {
      console.error('Erro ao buscar userSkills:', err);
      setError('Erro ao carregar os dados. Por favor, tente novamente.');
    }
    
    setLoading(false);
  }, [userId, token, navigate]);

  // Load skills on mount
  useEffect(() => {
    if (userId) fetchSkillsData();
  }, [userId, fetchSkillsData]);

  // Update skill level
  const handleUpdateLevel = async (userSkillId) => {
    setError('');
    try {
      const newLevel = editLevel[userSkillId];
      await enhancedSkillsService.updateUserSkill(userSkillId, newLevel);
      
      setEditLevel(prev => {
        const newState = { ...prev };
        delete newState[userSkillId];
        return newState;
      });
      
      await fetchSkillsData();
    } catch {
      setError('Erro ao atualizar o nível. Tente novamente.');
    }
  };

  // Delete skill
  const handleDeleteSkill = async (userSkillId) => {
    if (!window.confirm(MESSAGES.deleteConfirm)) return;
    
    setError('');
    setSuccessMessage('');
    
    try {
      await enhancedSkillsService.deleteUserSkill(userSkillId);
      await fetchSkillsData();
      setSuccessMessage('Skill excluída com sucesso!');
    } catch {
      setError('Erro ao excluir a skill. Tente novamente.');
    }
  };

  return {
    userSkills,
    loading,
    error,
    successMessage,
    editLevel,
    setEditLevel,
    fetchSkillsData,
    handleUpdateLevel,
    handleDeleteSkill,
    setError,
    setSuccessMessage
  };
};