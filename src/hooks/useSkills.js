import { useState, useCallback } from 'react';
import * as skillsService from '../services/skillsService';

export const useSkills = (userId, token) => {
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await skillsService.getUserSkills(userId, token);
      setUserSkills(data);
    } catch (err) {
      setError('Erro ao carregar skills');
    }
    setLoading(false);
  }, [userId, token]);

  return { userSkills, loading, error, fetchSkills, setUserSkills };
};