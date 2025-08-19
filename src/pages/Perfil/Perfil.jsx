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