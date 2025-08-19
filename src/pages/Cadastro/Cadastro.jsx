import React, { useState } from 'react';
import { FaInfoCircle, FaRegEye, FaRegEyeSlash, FaCheckCircle } from 'react-icons/fa';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';
import { cadastrar as cadastrarService } from '../../services/authService';
import logo from '../../assets/image.png';
import './Cadastro.css';

const Cadastro = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);


  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmailExistsModal, setShowEmailExistsModal] = useState(false);

  const handleCadastro = async (e) => {
    e.preventDefault();
    if (!email || !nickname || !senha || !confirmarSenha) {
      setError('Preencha todos os campos.');
      return;
    }
    try {
      const result = await cadastrarService({ email, nickname, password: senha });
      if (result && (result.success || result.message === 'Usuário cadastrado com sucesso!')) {
        setShowSuccessModal(true);
        localStorage.setItem('loginEmail', email);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/login');
        }, 1500);
      } else if (result?.error === 'E-mail já cadastrado' || result?.error === 'Nickname já cadastrado') {
        setShowEmailExistsModal(true);
      } else {
        setError(result?.error || 'Erro ao cadastrar. Tente novamente.');
      }
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg === 'E-mail já cadastrado' || msg === 'Nickname já cadastrado') {
        setShowEmailExistsModal(true);
      } else {
        setError(msg || 'Erro ao cadastrar.');
      }
    }
  };

  return (
    <div className="cadastro-bg">
      <div className="cadastro-card">
        <header className="cadastro-header">
          <img src={logo} alt="Logo" className="cadastro-logo" />
          <h1 className="cadastro-title">Cadastre-se</h1>
        </header>
        <form className="cadastro-form" onSubmit={handleCadastro}>
          {/* Removido: {success && <div className="cadastro-success">{success}</div>} */}
          {error && <div className="cadastro-error">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="cadastro-email">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Digite seu e-mail"
              className="cadastro-input"
              autoFocus
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="cadastro-nickname">User</label>
            <input
              type="text"
              id="cadastro-nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              required
              placeholder="Digite seu usuário"
              className="cadastro-input"
            />
          </div>
          
          <div className="input-group senha-field">
            <label htmlFor="cadastro-senha">Senha</label>
            <div className="senha-wrapper">
              <input
                type={showSenha ? 'text' : 'password'}
                id="cadastro-senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                placeholder="Crie sua senha"
                className="cadastro-input"
              />
              <button type="button" className="btn-visualizar" onClick={() => setShowSenha(s => !s)} aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}>
                {showSenha ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>
          
          <div className="input-group senha-field">
            <label htmlFor="cadastro-confirmar-senha">Confirme a Senha</label>
            <div className="senha-wrapper">
              <input
                type={showConfirmar ? 'text' : 'password'}
                id="cadastro-confirmar-senha"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                required
                placeholder="Confirme sua senha"
                className="cadastro-input"
              />
              <button type="button" className="btn-visualizar" onClick={() => setShowConfirmar(s => !s)} aria-label={showConfirmar ? 'Ocultar senha' : 'Mostrar senha'}>
                {showConfirmar ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>
          
          <button className="btn-cadastro" type="submit">Cadastrar</button>
          <button className="btn-voltar" type="button" onClick={() => navigate('/login')}>Voltar</button>
        </form>
        
        <Modal isOpen={showEmailExistsModal} onClose={() => setShowEmailExistsModal(false)}>
          <div className="modal-content">
            <h3>E-mail ou usuário já cadastrado!</h3>
            <p>Parece que o e-mail ou nome de usuário que você inseriu já está em uso. Por favor, tente novamente com outros dados.</p>
            <div className="modal-buttons">
              <button className="btn-modal-cancel" onClick={() => setShowEmailExistsModal(false)}>Fechar</button>
              <button className="btn-modal-save" onClick={() => {
                setShowEmailExistsModal(false);
                navigate('/login');
              }}>Ir para Login</button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
          <div className="modal-content modal-content-success">
            <FaCheckCircle className="success-icon" />
            <h3 className="success-title">Cadastro Realizado!</h3>
            <p className="success-message">Seu cadastro foi concluído com sucesso. Você será redirecionado(a) para a tela de login.</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Cadastro;