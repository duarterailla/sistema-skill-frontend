<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import MESSAGES from '../../constants/messages';
import './Perfil.css';

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
  setSaveError(MESSAGES.sessionExpired);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/usuarios/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = response.data;
        // Converte a data de nascimento para o formato YYYY-MM-DD para o input
        if (userData.dataNascimento && !userData.dataNascimento.includes('T')) {
          userData.dataNascimento = new Date(userData.dataNascimento).toISOString().slice(0, 10);
        }
        setUser(userData);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
  setSaveError(MESSAGES.profileLoadError);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSavePersonalInfo = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const token = localStorage.getItem('token');
      // Garante formato yyyy-MM-dd
      let dataNascimento = user.dataNascimento;
      if (dataNascimento) {
        const dateObj = new Date(dataNascimento);
        if (!isNaN(dateObj)) {
          dataNascimento = dateObj.toISOString().slice(0, 10);
        }
      }
      const personalInfo = {
        nomeCompleto: user.nomeCompleto,
        dataNascimento,
        informacoesRelevantes: user.informacoesRelevantes,
        contato: user.contato
      };
      await api.put(`/api/usuarios/${userId}/info-pessoais`, personalInfo, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSaveSuccess(true);
      setIsEditing(false);
    } catch {
      setSaveError('Erro ao salvar informações pessoais. Tente novamente.');
  setSaveError(MESSAGES.profileSaveError);
    } finally {
      setSaving(false);
    }
  };


  const handleDeleteAccount = async () => {
    const confirm = window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.clear();
      navigate('/cadastro');
    } catch (error) {
      alert('Erro ao excluir conta. Tente novamente.');
  alert(MESSAGES.deleteError);
    }
  };

  if (!user) {
    // Carregando perfil
    return (
      <div className="perfil-bg">
        <div className="perfil-container">
          {/* Voltar para Home */}
          <div className="perfil-header">
            <button className="btn" onClick={() => navigate('/home')}>Voltar para Home</button>
          </div>
          <h2>Carregando perfil...</h2>
          {/* Erro */}
          {saveError && <p className="error-message">{saveError}</p>}
        </div>
      </div>
    );
  }

  return (
    // Perfil do usuário
    <div className="perfil-bg">
      <div className="perfil-container">
        {/* Botões de navegação */}
        <div className="perfil-header">
          <button className="btn" onClick={() => navigate('/home')}>Voltar para Home</button>
          <button className="btn-delete" onClick={handleDeleteAccount}>Excluir Conta</button>
        </div>

        {/* Título */}
        <h2>Meu Perfil</h2>

        {/* Dados da conta */}
        <div className="perfil-info">
          <h3>Informações da Conta</h3>
          <div><strong>Nome de Usuário:</strong> {user.nickname || 'Não informado'}</div>
          <div><strong>Email:</strong> {user.email || 'Não informado'}</div>
          <div><strong>Membro desde:</strong> {user.dataCadastro ? new Date(user.dataCadastro).toLocaleDateString() : '---'}</div>
        </div>

        {/* Formulário de edição */}
        <form className="perfil-form" onSubmit={(e) => e.preventDefault()}>
          <hr />
          <h3>Informações Pessoais</h3>
          {/* Nome Completo */}
          <div className="input-group">
            <label htmlFor="nomeCompleto">Nome Completo</label>
            <input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              value={user.nomeCompleto || ''}
              onChange={handleInputChange}
              placeholder="Digite seu nome completo"
              autoComplete="name"
              disabled={!isEditing}
            />
          </div>
          {/* Data de Nascimento */}
          <div className="input-group">
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={user.dataNascimento || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          {/* Contato */}
          <div className="input-group">
            <label htmlFor="contato">Contato</label>
            <input
              type="text"
              id="contato"
              name="contato"
              value={user.contato || ''}
              onChange={handleInputChange}
              placeholder="Telefone, WhatsApp ou outro contato"
              disabled={!isEditing}
            />
          </div>
          {/* Informações Relevantes */}
          <div className="input-group">
            <label htmlFor="informacoesRelevantes">Informações Relevantes</label>
            <textarea
              id="informacoesRelevantes"
              name="informacoesRelevantes"
              rows="4"
              value={user.informacoesRelevantes || ''}
              onChange={handleInputChange}
              placeholder="Compartilhe informações relevantes sobre você, como hobbies, interesses, etc."
              disabled={!isEditing}
            ></textarea>
          </div>

          {/* Mensagens */}
          <div className="message-area">
            {saveError && <div className="error-message">{saveError}</div>}
            {saveSuccess && <div className="success-message">{MESSAGES.profileSaved}</div>}
          </div>
          
          {/* Botões editar/salvar */}
          <div className="perfil-actions">
            {!isEditing ? (
              <button
                type="button"
                className="btn"
                onClick={() => setIsEditing(true)}
              >
                Editar Perfil
              </button>
            ) : (
              <button
                type="button"
                className="btn"
                onClick={handleSavePersonalInfo}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Informações'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
=======
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Perfil.css';

const Perfil = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !token) return;
    api.get(`/api/usuarios/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, [userId, token]);

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja eliminar sua conta? Esta ação é irreversível.')) {
      fetch(`http://localhost:8080/api/usuarios/${userId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        }
      })
        .then(res => {
          if (res.ok) {
            localStorage.clear();
            alert('Conta eliminada com sucesso.');
            navigate('/login');
          } else {
            alert('Erro ao eliminar conta.');
          }
        })
        .catch(() => alert('Erro ao eliminar conta.'));
    }
  };

  if (!user) {
    return (
      <div className="perfil-bg">
        <div className="perfil-container">
          <button
            className="btn-modal-save"
            style={{ minWidth: 120, marginBottom: '1.2rem' }}
            onClick={() => navigate('/home')}
          >
            Voltar para Home
          </button>
          <h2>Perfil não encontrado</h2>
          <p>Não foi possível carregar os dados do perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-bg">
      <div className="perfil-container">
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <button
            className="btn-modal-save"
            style={{ minWidth: 80, padding: '0.4rem 0.8rem', fontSize: '0.93rem', fontWeight: 600 }}
            onClick={() => navigate('/home')}
          >
            Voltar para Home
          </button>
          <button
            className="btn-modal-cancel"
            style={{ minWidth: 80, padding: '0.4rem 0.8rem', fontSize: '0.93rem', background: '#e74c3c', color: '#fff', border: 'none', fontWeight: 600 }}
            onClick={handleDeleteAccount}
          >
            Eliminar Conta
          </button>
        </div>
        <h2>Perfil do Usuário</h2>
        <div className="perfil-info">
          <div><strong>Nome:</strong> {user.nome || user.nickname || 'Não informado'}</div>
          <div><strong>Email:</strong> {user.email || 'Não informado'}</div>
        </div>
        <div className="perfil-details">
          <h3>Detalhes</h3>
          <ul>
            <li>Data de cadastro: {user.dataCadastro ? new Date(user.dataCadastro).toLocaleDateString() : '---'}</li>
            <li>Status: {user.status || '---'}</li>
            <li>Último acesso: {user.ultimoAcesso ? new Date(user.ultimoAcesso).toLocaleString() : '---'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

>>>>>>> 75b9b479a453719b25ebf1ec8155f7004fe16684
