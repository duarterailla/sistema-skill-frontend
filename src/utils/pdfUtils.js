import api from '../services/api';

export const downloadSkillsPdf = (userId, token) => {
  api.get(`/api/user-skills/${userId}/pdf`, {
    responseType: 'blob',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `skills_usuario_${userId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch(() => alert('Erro ao baixar o PDF.'));
};