<<<<<<< HEAD
import api from '../services/api';

export const downloadSkillsPdf = async (userId, token) => {
  try {
    // Busca o usuário para pegar o nome completo
    const userResponse = await api.get(`/api/usuarios/${userId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const nomeCompleto = userResponse.data.nomeCompleto || `usuario_${userId}`;

    // Baixa o PDF
    const pdfResponse = await api.get(`/api/user-skills/${userId}/pdf`, {
      responseType: 'blob',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
    const link = document.createElement('a');
    link.href = url;
    // Remove espaços e caracteres especiais do nome
    const nomeArquivo = `skills_${nomeCompleto.replace(/\s+/g, '_').replace(/[^\w\-]/g, '')}.pdf`;
    link.setAttribute('download', nomeArquivo);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch {
    alert('Erro ao baixar o PDF.');
  }
=======
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
>>>>>>> 75b9b479a453719b25ebf1ec8155f7004fe16684
};