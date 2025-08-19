import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';
import { cadastrar as cadastrarService } from '../../services/authService';
import { isPasswordMatch } from '../../utils/validators';
import logo from '../../assets/image.png';
import './Cadastro.css';

const Cadastro = () => {
  const navigate = useNavigate();
  
  // Carrega os dados do localStorage na inicialização
  const [email, setEmail] = useState(localStorage.getItem('cadastroEmail') || '');
  const [senha, setSenha] = useState(localStorage.getItem('cadastroSenha') || '');
  const [nickname, setNickname] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [showUserHint, setShowUserHint] = useState(false);
  const [gravarDados, setGravarDados] = useState(!!localStorage.getItem('cadastroEmail'));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEmailExistsModal, setShowEmailExistsModal] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 2000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => setError(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Apenas carrega os dados quando o componente é montado.
  // Não há mais o useEffect que salva a cada digitação.
  useEffect(() => {
    setGravarDados(!!localStorage.getItem('cadastroEmail'));
  }, []);

  const handleGravarDados = (e) => {
    const checked = e.target.checked;
    setGravarDados(checked);
    // Limpa o storage imediatamente se a caixa for desmarcada
    if (!checked) {
      localStorage.removeItem('cadastroEmail');
      localStorage.removeItem('cadastroSenha');
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validações antes de enviar para o backend
    if (!isPasswordMatch(senha, confirmarSenha)) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!email || !nickname) {
      setError('Preencha todos os campos.');
      return;
    }
    
    try {
      const result = await cadastrarService({ email, nickname, password: senha });
      
      if (result && (result.success || result.message === 'Usuário cadastrado com sucesso!')) {
        setSuccess('Cadastro realizado com sucesso!');
        
        // Salva os dados APENAS se o cadastro foi um sucesso e a opção estiver marcada.
        if (gravarDados) {
          localStorage.setItem('cadastroEmail', email);
          localStorage.setItem('cadastroSenha', senha);
        }

        setTimeout(() => navigate('/home'), 1500);
      } else if (result?.error === 'E-mail já cadastrado') {
        setShowEmailExistsModal(true);
      } else if (result?.error === 'Nickname já cadastrado') {
        setError('Nickname já cadastrado');
      } else {
        setError(result?.error || 'Erro ao cadastrar.');
      }
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg === 'E-mail já cadastrado') {
        setShowEmailExistsModal(true);
      } else {
        setError(msg || 'Erro ao cadastrar.');
      }
    }
  };

  return (
    <div className="cadastro-bg">
      <div className="cadastro-card">
        <div className="cadastro-logo-title">
          <img src={logo} alt="Logo" className="cadastro-logo" style={{ width: 200, height: 'auto' }} />
        </div>
  <h1 className="cadastro-title">Cadastre-se</h1>
  <form className="cadastro-form" onSubmit={handleCadastro}>
          <label className="cadastro-label" htmlFor="cadastro-email">E-mail</label>
          <input
            id="cadastro-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="E-mail"
            className="cadastro-input"
            autoFocus
          />
          <label className="cadastro-label" htmlFor="cadastro-nickname">Nome de usuário</label>
          <input
            id="cadastro-nickname"
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
            placeholder="Nome de usuário"
            className="cadastro-input"
            onFocus={() => setShowUserHint(true)}
            onBlur={() => setShowUserHint(false)}
          />
          {showUserHint && (
            <div className="user-hint">
              <FaInfoCircle style={{ color: '#1976d2', fontSize: 16, flexShrink: 0 }} />
              <span>Você poderá acessar sua conta com seu user.</span>
            </div>
          )}
          <label className="cadastro-label" htmlFor="cadastro-senha">Senha</label>
          <div className="senha-wrapper">
            <input
              id="cadastro-senha"
              type={showSenha ? 'text' : 'password'}
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              placeholder="Senha"
              className="cadastro-input"
              onFocus={() => setShowPasswordHint(true)}
              onBlur={() => setShowPasswordHint(false)}
            />
            <button type="button" className="btn-visualizar" onClick={() => setShowSenha(s => !s)} aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}>
              {showSenha ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          {showPasswordHint && (
            <div className="password-hint">
              <FaInfoCircle style={{ color: '#1976d2', fontSize: 18, flexShrink: 0 }} />
              <span>Senha deve conter <b>8+ caracteres</b>, <b>letra maiúscula</b>, <b>minúscula</b> e <b>número</b>.</span>
            </div>
          )}
          <label className="cadastro-label" htmlFor="cadastro-confirmar">Confirmar senha</label>
          <div className="senha-wrapper">
            <input
              id="cadastro-confirmar"
              type={showConfirmar ? 'text' : 'password'}
              value={confirmarSenha}
              onChange={e => setConfirmarSenha(e.target.value)}
              required
              placeholder="Confirmar senha"
              className="cadastro-input"
            />
            <button type="button" className="btn-visualizar" onClick={() => setShowConfirmar(s => !s)} aria-label={showConfirmar ? 'Ocultar senha' : 'Mostrar senha'}>
              {showConfirmar ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          <div className="cadastro-remember-row">
            <input
              type="checkbox"
              checked={gravarDados}
              onChange={handleGravarDados}
              id="gravarDados"
            />
            <label htmlFor="gravarDados">Gravar e-mail e senha</label>
          </div>
          {error && <div className="cadastro-error">{error}</div>}
          {success && <div className="cadastro-success">{success}</div>}
          <button className="btn-cadastro" type="submit">Cadastrar</button>
          <button className="btn-voltar" type="button" onClick={() => navigate('/login')}>Voltar</button>
        </form>
        <Modal isOpen={showEmailExistsModal} onClose={() => setShowEmailExistsModal(false)}>
          <div style={{ padding: 20 }}>
            <h3>E-mail já cadastrado!</h3>
            <button onClick={() => setShowEmailExistsModal(false)}>Fechar</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default Cadastro;