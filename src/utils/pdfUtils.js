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
};