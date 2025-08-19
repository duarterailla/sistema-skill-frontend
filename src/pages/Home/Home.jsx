import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import * as skillsService from '../../services/skillsService';
import { listarCategorias } from '../../services/categoriaService';
import Modal from '../../components/Modal';
import './Home.css';
import NekiLogo from '../../assets/image.png';

const enhancedSkillsService = {
  ...skillsService,
  addUserSkill: async (userId, skillId, level, descricao) => {
    if (!userId || !skillId || !level) throw new Error('Parâmetros obrigatórios ausentes');
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
  }
};

const downloadSkillsPdf = (userId, token) => {
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

const getSkillImageUrl = (skill) => {
  const imageUrl = skill?.imageUrl ||
    skill?.imagem_url ||
    skill?.image_url ||
    skill?.imagemUrl ||
    skill?.url ||
    skill?.img ||
    skill?.photo ||
    skill?.picture;
  return imageUrl && imageUrl.trim() !== '' ? imageUrl : '/placeholder-skill.png';
};

const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [userSkills, setUserSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLevel, setEditLevel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillImageUrl, setNewSkillImageUrl] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('');
  const [newSkillDescription, setNewSkillDescription] = useState('');
  const [imageUrlPreview, setImageUrlPreview] = useState('');
  const [imageLoadError, setImageLoadError] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillSelecionada, setSkillSelecionada] = useState('');

  // Carrega categorias e skills do banco
  useEffect(() => {
    listarCategorias()
      .then(data => {
        setCategorias(data);
        console.log('Categorias:', data);
      })
      .catch(err => {
        setCategorias([]);
        console.error('Erro ao buscar categorias:', err);
      });

    skillsService.getSkills()
      .then(data => {
        setSkills(data);
        console.log('Skills:', data);
      })
      .catch(err => {
        setSkills([]);
        console.error('Erro ao buscar skills:', err);
      });
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userId) navigate('/login');
  }, [userId, navigate]);

  const fetchSkillsData = useCallback(async () => {
    setLoading(true);
    setError('');
    if (!token) {
      setError('Sessão expirada. Faça login novamente.');
      setLoading(false);
      navigate('/login');
      return;
    }
    try {
      const userSkillsData = await enhancedSkillsService.getUserSkills(userId);
      setUserSkills(userSkillsData);
    } catch (err) {
      console.error('Erro real ao buscar userSkills:', err);
      setError('Erro ao carregar os dados. Por favor, tente novamente.');
    }
    setLoading(false);
  }, [userId, token, navigate]);

  useEffect(() => {
    if (userId) fetchSkillsData();
  }, [userId, fetchSkillsData]);

  // Adiciona skill já existente do banco
  const handleAddSkill = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!userId || !token) {
      setError('Sessão expirada. Faça login novamente.');
      return;
    }
    if (!skillSelecionada || !newSkillLevel) {
      setError('Selecione uma categoria, uma skill e o nível.');
      return;
    }
    try {
      const userSkillsData = await enhancedSkillsService.getUserSkills(userId);
      const alreadyHasSkill = userSkillsData.some(us => us.skill?.id === parseInt(skillSelecionada));
      if (alreadyHasSkill) throw new Error('Você já possui esta skill');
      await enhancedSkillsService.addUserSkill(
        userId,
        skillSelecionada,
        newSkillLevel,
        newSkillDescription // <-- descrição personalizada do usuário
      );
      await fetchSkillsData();
      closeAddSkillModal();
      setSuccessMessage('Skill adicionada com sucesso!');
    } catch (err) {
      setError(err.message.includes('já possui') ?
        'Você já possui esta skill.' :
        'Erro ao adicionar skill. Tente novamente.');
    }
  }, [userId, token, skillSelecionada, newSkillLevel, newSkillDescription, fetchSkillsData]);

  // Adiciona nova skill ao banco e ao usuário
  const handleAddNovaSkill = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!userId || !token) {
      setError('Sessão expirada. Faça login novamente.');
      return;
    }
    if (!newSkillName || !newSkillImageUrl || !newSkillLevel || !newSkillDescription || !categoriaSelecionada) {
      setError('Preencha todos os campos e selecione uma categoria.');
      return;
    }
    if (!isValidImageUrl(newSkillImageUrl)) {
      setError('Por favor, insira uma URL de imagem válida.');
      return;
    }
    try {
      const novaSkill = {
        nome: newSkillName.trim(),
        descricao: newSkillDescription.trim(),
        imagem_url: newSkillImageUrl.trim(),
        categoria_id: categoriaSelecionada
      };
      const newSkillResponse = await api.post('/api/skills', novaSkill, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const skillId = newSkillResponse.data.id;
      await enhancedSkillsService.addUserSkill(userId, skillId, newSkillLevel);
      await fetchSkillsData();
      closeAddSkillModal();
      setSuccessMessage('Skill adicionada com sucesso!');
      // Atualiza lista de skills para aparecer na seleção
      skillsService.getSkills().then(setSkills).catch(() => {});
    } catch (err) {
      setError('Erro ao adicionar nova skill. Tente novamente.');
    }
  }, [userId, token, newSkillName, newSkillImageUrl, newSkillLevel, newSkillDescription, categoriaSelecionada, fetchSkillsData]);

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

  const handleDeleteSkill = async (userSkillId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta skill?')) return;
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setNewSkillImageUrl(url);
    setImageUrlPreview(isValidImageUrl(url) ? url : '');
  };

  const handleImageError = (userSkillId) => {
    setImageLoadError(prev => ({
      ...prev,
      [userSkillId]: true
    }));
  };

  const closeAddSkillModal = () => {
    setIsModalOpen(false);
    setNewSkillName('');
    setNewSkillImageUrl('');
    setNewSkillLevel('');
    setNewSkillDescription('');
    setCategoriaSelecionada('');
    setSkillSelecionada('');
    setImageUrlPreview('');
    setError('');
  };

  if (loading) {
    return (
      <div className="home-bg">
        <div className="skills-table-container" style={{ textAlign: 'center' }}>
          <p>Carregando suas skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-bg">
      <div className="skills-table-container">
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button
            className="btn-modal-save"
            style={{ minWidth: 80, fontWeight: 600, padding: '0.5rem 1rem', fontSize: '0.95rem' }}
            onClick={() => downloadSkillsPdf(userId, token)}
          >
            Baixar PDF das Skills
          </button>
          <button
            className="btn-modal-save"
            style={{ minWidth: 80, fontWeight: 600, padding: '0.5rem 1rem', fontSize: '0.95rem' }}
            onClick={() => navigate('/perfil')}
          >
            Perfil
          </button>
          <button
            className="btn-logout"
            onClick={handleLogout}
            style={{ minWidth: 80, padding: '0.5rem 1rem', fontSize: '0.95rem' }}
          >
            Sair
          </button>
        </div>

        <div className="skills-table-logo">
          <img src={NekiLogo} alt="Neki Logo" />
          <h2 className="skills-table-title">Minhas Skills</h2>
        </div>

        {successMessage && (
          <p className="home-success" style={{
            background: '#e6fffa',
            color: '#059669',
            border: '1px solid #b6f3e6',
            borderRadius: 8,
            padding: '0.8rem 1.2rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 600
          }}>
            {successMessage}
          </p>
        )}

        {error && <p className="home-error">{error}</p>}

        <table className="skills-table">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome da Skill</th>
              <th>Nível</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {userSkills.length > 0 ? (
              userSkills.map(userSkill => {
                const skillImageUrl = getSkillImageUrl(userSkill.skill);
                const hasImageError = imageLoadError[userSkill.id];
                return (
                  <tr key={userSkill.id}>
                    <td className="skill-icon-cell">
                      <img
                        src={hasImageError ? '/placeholder-skill.png' : skillImageUrl}
                        alt={userSkill.skill?.name || userSkill.skill?.nome || 'Skill'}
                        onError={() => handleImageError(userSkill.id)}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'contain',
                          borderRadius: '8px'
                        }}
                      />
                    </td>
                    <td>
                      <div className="skill-name">
                        {userSkill.skill?.name || userSkill.skill?.nome || 'Nome não disponível'}
                      </div>
                    </td>
                    <td>
                      {editLevel[userSkill.id] !== undefined ? (
                        <div className="edit-level-controls">
                          <input
                            type="text"
                            value={editLevel[userSkill.id]}
                            onChange={(e) => setEditLevel({
                              ...editLevel,
                              [userSkill.id]: e.target.value
                            })}
                            className="level-input"
                          />
                          <button
                            onClick={() => handleUpdateLevel(userSkill.id)}
                            className="btn-save-level"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditLevel({
                              ...editLevel,
                              [userSkill.id]: undefined
                            })}
                            className="btn-cancel-level"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="skill-level-display">
                          <div className="skill-level">{userSkill.level}</div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="skill-description">
                        {userSkill.skill?.descricao?.trim() || 'Descrição não disponível'}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => setEditLevel({
                          ...editLevel,
                          [userSkill.id]: userSkill.level
                        })}
                        className="btn-edit"
                        style={{
                          minWidth: 90,
                          padding: '0.5rem 1.2rem',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          marginRight: '0.5rem'
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(userSkill.id)}
                        className="btn-delete"
                        style={{
                          minWidth: 90,
                          padding: '0.5rem 1.2rem',
                          fontSize: '0.95rem',
                          fontWeight: 600
                        }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                  Você ainda não tem nenhuma skill. Adicione uma para começar!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          className="btn-add-skill"
          onClick={() => setIsModalOpen(true)}
        >
          + Adicionar Skill
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeAddSkillModal}>
        <div className="modal-content">
          <h3>Adicionar Skill Existente</h3>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleAddSkill}>
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="categoria-select">Categoria:</label>
              <select
                id="categoria-select"
                value={categoriaSelecionada}
                onChange={e => setCategoriaSelecionada(e.target.value)}
                required
                style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', marginBottom: '1rem' }}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="skill-select">Skill:</label>
              <select
                id="skill-select"
                value={skillSelecionada}
                onChange={e => setSkillSelecionada(e.target.value)}
                required
                style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', marginBottom: '1rem' }}
                disabled={!categoriaSelecionada}
              >
                <option value="">Selecione uma skill</option>
                {skills
                  .filter(skill =>
                    String(skill.categoria_id ?? skill.categoria?.id) === String(categoriaSelecionada)
                  )
                  .map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.nome || skill.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="skill-description-input-existente">Descrição:</label>
              <textarea
                id="skill-description-input-existente"
                value={newSkillDescription}
                onChange={e => setNewSkillDescription(e.target.value)}
                rows="3"
                placeholder="Descreva sua experiência com esta skill..."
                required
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="skill-level-input">Nível:</label>
              <select
                id="skill-level-input"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                required
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  padding: '0.7rem',
                  borderRadius: 8,
                  fontSize: '1rem',
                  border: '1px solid #e2e8f0'
                }}
              >
                <option value="">Selecione o nível</option>
                <option value="Iniciante/Básico">Iniciante/Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button type="submit" className="btn-modal-save">
                Salvar
              </button>
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={closeAddSkillModal}
              >
                Cancelar
              </button>
            </div>
          </form>
          <hr style={{ margin: '2rem 0' }} />
          <h3>Ou cadastrar nova skill</h3>
          <form onSubmit={handleAddNovaSkill}>
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="categoria-select-nova">Categoria:</label>
              <select
                id="categoria-select-nova"
                value={categoriaSelecionada}
                onChange={e => setCategoriaSelecionada(e.target.value)}
                required
                style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', marginBottom: '1rem' }}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="skill-name-input">Nome da Skill:</label>
              <input
                type="text"
                id="skill-name-input"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                required
                style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
              />
            </div>
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="skill-image-url">URL da Imagem:</label>
              <input
                type="url"
                id="skill-image-url"
                value={newSkillImageUrl}
                onChange={handleImageUrlChange}
                placeholder="https://exemplo.com/imagem.png"
                required
                style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Insira uma URL válida de imagem (ex: https://exemplo.com/imagem.png)
              </small>
            </div>
            {imageUrlPreview && (
              <div className="image-preview" style={{ width: '100%' }}>
                <p>Prévia da Imagem:</p>
                <img
                  src={imageUrlPreview}
                  alt="Prévia da Skill"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <div style={{ display: 'none', color: 'red', fontSize: '12px' }}>
                  Erro ao carregar a imagem. Verifique se a URL está correta.
                </div>
              </div>
            )}
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="skill-level-input-nova">Nível:</label>
              <select
                id="skill-level-input-nova"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                required
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  padding: '0.7rem',
                  borderRadius: 8,
                  fontSize: '1rem',
                  border: '1px solid #e2e8f0'
                }}
              >
                <option value="">Selecione o nível</option>
                <option value="Iniciante/Básico">Iniciante/Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="skill-description-input">Descrição:</label>
              <textarea
                id="skill-description-input"
                value={newSkillDescription}
                onChange={(e) => setNewSkillDescription(e.target.value)}
                rows="3"
                placeholder="Descreva sua experiência com esta skill..."
                required
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
            <div className="modal-buttons">
              <button type="submit" className="btn-modal-save">
                Salvar Nova Skill
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

>>>>>>> 75b9b479a453719b25ebf1ec8155f7004fe16684
export default Home;