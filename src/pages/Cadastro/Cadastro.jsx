import React, { useState } from 'react';
import { FaInfoCircle, FaRegEye, FaRegEyeSlash, FaCheckCircle } from 'react-icons/fa';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';
import { cadastrar as cadastrarService } from '../../services/authService';
import logo from '../../assets/image.png';
import MESSAGES from '../../constants/messages';
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
  setError(msg || MESSAGES.addError);
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
              placeholder="Ex: meu_usuario"
              className="cadastro-input"
            />
            {nickname && (
              <div style={{
                marginTop: '0.7rem',
                background: '#e3f2fd',
                color: '#174ea6',
                border: '1px solid #90caf9',
                borderRadius: '0.7rem',
                padding: '0.7rem 1.2rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
                textAlign: 'center'
              }}>
                Poderá acessar com ele
              </div>
            )}
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
            {senha && (
              <div style={{
                marginTop: '0.7rem',
                background: '#fffde7',
                color: '#b45309',
                border: '1px solid #ffe082',
                borderRadius: '0.7rem',
                padding: '0.7rem 1.2rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(255,193,7,0.08)',
                textAlign: 'left',
                fontSize: '0.98rem'
              }}>
                <div><b>Senha forte:</b></div>
                <ul style={{margin: '0.5rem 0 0 1.2rem', padding: 0, fontWeight: 400, fontSize: '0.97rem'}}>
                  <li>Mínimo de 8 caracteres</li>
                  <li>Pelo menos uma letra</li>
                  <li>Pelo menos um número</li>
                  <li>Pode conter caracteres especiais (!@#$%^&*()_+=-)</li>
                </ul>
              </div>
            )}
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
            <h3>{MESSAGES.emailExists}</h3>
            <p>{MESSAGES.emailExists}</p>
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