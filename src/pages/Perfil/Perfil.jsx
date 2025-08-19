import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setSaveError('ID do usuário não encontrado. Faça login novamente.');
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
        setSaveError('Erro ao carregar o perfil. Por favor, tente novamente.');
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem('token');
      // Garante que informacoesRelevantes seja string e dataNascimento esteja no formato correto
      const payload = {
        nomeCompleto: typeof user.nomeCompleto === 'string' ? user.nomeCompleto : '',
        contato: typeof user.contato === 'string' ? user.contato : '',
        informacoesRelevantes: Array.isArray(user.informacoesRelevantes)
          ? user.informacoesRelevantes.join('\n')
          : (typeof user.informacoesRelevantes === 'string' ? user.informacoesRelevantes : ''),
        dataNascimento: user.dataNascimento
          ? new Date(user.dataNascimento).toISOString().slice(0, 10)
          : ''
      };
      console.log(payload);
      await api.put(`/api/usuarios/${userId}/info-pessoais`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSaveSuccess(true);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setSaveError('Erro ao salvar perfil. Tente novamente.');
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
    }
  };

  if (!user) {
    return (
      <div className="perfil-bg">
        <div className="perfil-container">
          <div className="perfil-header">
            <button className="btn" onClick={() => navigate('/home')}>Voltar para Home</button>
          </div>
          <h2>Carregando perfil...</h2>
          {saveError && <p className="error-message">{saveError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-bg">
      <div className="perfil-container">
        <div className="perfil-header">
          <button className="btn" onClick={() => navigate('/home')}>Voltar para Home</button>
          <button className="btn-delete" onClick={handleDeleteAccount}>Excluir Conta</button>
        </div>

        <h2>Meu Perfil</h2>

        <div className="perfil-info">
          <h3>Informações da Conta</h3>
          <div><strong>Nome de Usuário:</strong> {user.nickname || 'Não informado'}</div>
          <div><strong>Email:</strong> {user.email || 'Não informado'}</div>
          <div><strong>Membro desde:</strong> {user.dataCadastro ? new Date(user.dataCadastro).toLocaleDateString() : '---'}</div>
        </div>

        <form className="perfil-form" onSubmit={(e) => e.preventDefault()}>
          <hr />
          <h3>Informações Pessoais</h3>
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
            />
          </div>
          <div className="input-group">
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={user.dataNascimento || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="informacoesRelevantes">Informações Relevantes</label>
            <textarea
              id="informacoesRelevantes"
              name="informacoesRelevantes"
              rows="4"
              value={user.informacoesRelevantes || ''}
              onChange={handleInputChange}
              placeholder="Compartilhe informações relevantes sobre você, como hobbies, interesses, etc."
            ></textarea>
          </div>

          <div className="message-area">
            {saveError && <div className="error-message">{saveError}</div>}
            {saveSuccess && <div className="success-message">Perfil salvo com sucesso!</div>}
          </div>
          
          <div className="perfil-actions">
            <button
              type="button"
              className="btn"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Perfil;