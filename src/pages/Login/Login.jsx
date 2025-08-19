import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../../services/authService';
import MESSAGES from '../../constants/messages';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import logo from '../../assets/image.png';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  // Inicializa o estado com base no localStorage
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [gravarSenha, setGravarSenha] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  // useEffect para carregar dados do localStorage e sincronizar o checkbox
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    const loginEmail = localStorage.getItem('loginEmail');

    if (savedEmail) {
      setEmail(savedEmail);
      setSenha(savedPassword || '');
      setGravarSenha(true);
    } else if (loginEmail) {
      setEmail(loginEmail);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await loginService(email, senha);

      if (result?.token && result?.userId) {
        if (gravarSenha) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem('savedPassword', senha);
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }
        
        localStorage.removeItem('loginEmail');

        navigate('/home');
      } else {
        setError(MESSAGES.incorrectUser);
      }
    } catch (err) {
      // Mensagens customizadas conforme erro do backend
      const backendError = err.response?.data?.error?.toLowerCase() || err.response?.data?.message?.toLowerCase();
      if (backendError) {
        if (backendError.includes('senha')) {
          setError(MESSAGES.incorrectPassword);
        } else if (backendError.includes('usuário') || backendError.includes('email') || backendError.includes('e-mail')) {
          setError(MESSAGES.incorrectUser);
        } else {
          setError(backendError);
        }
      } else {
        setError('Ocorreu um erro no login. Por favor, tente novamente mais tarde.');
      }
    }
  };

  const handleGravarSenha = (e) => {
    const checked = e.target.checked;
    setGravarSenha(checked);
    // Remove os dados do storage imediatamente se o usuário desmarcar a opção.
    if (!checked) {
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedPassword');
    } else {
      // Salva os dados imediatamente se o usuário marcar a opção.
      localStorage.setItem('savedEmail', email);
      localStorage.setItem('savedPassword', senha);
    }
  };

  return (
    <div className="login-bg">
      <main className="login-card">
        <header className="login-header">
          <img src={logo} alt="Logo da Empresa" className="login-logo" />
        </header>
        <form className="login-form" onSubmit={handleLogin} noValidate>
          {error && <div className="login-error">{error}</div>}
          <div className="input-group">
            <label htmlFor="login-email" className="login-label">Usuário ou E-mail</label>
            <input
              id="login-email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Digite seu e-mail ou usuário"
              className="login-input"
              autoFocus
            />
          </div>
          <div className="input-group senha-field">
            <label htmlFor="login-senha" className="login-label">Senha</label>
            <div className="senha-wrapper">
              <input
                id="login-senha"
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                placeholder="Digite sua senha"
                className="login-input"
                onFocus={() => setShowPasswordHint(true)}
                onBlur={() => setShowPasswordHint(false)}
              />
              <button
                type="button"
                className="btn-visualizar"
                onClick={() => setMostrarSenha(prev => !prev)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {showPasswordHint && (
              <div className="password-hint">
                <FaInfoCircle />
                <span>Senha deve conter <b>8+ caracteres</b>, <b>letra maiúscula</b>, <b>minúscula</b> e <b>número</b>.</span>
              </div>
            )}
          </div>
          <div className="login-remember-row">
            <input
              type="checkbox"
              checked={gravarSenha}
              onChange={handleGravarSenha}
              id="gravarSenha"
            />
            <label htmlFor="gravarSenha">Gravar Senha</label>
          </div>
          <button className="btn-login" type="submit">
            Entrar
          </button>
          <button className="btn-register" type="button" onClick={() => navigate('/cadastro')}>
            Cadastrar-se
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;