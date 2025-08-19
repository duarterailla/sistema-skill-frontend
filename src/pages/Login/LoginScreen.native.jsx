import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { login as loginService } from '../../services/authService';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const result = await loginService(email, senha);
      if (result?.token && result?.userId) {
        // Salva token/localStorage conforme necessário
        navigation.navigate('Home');
      } else {
        setError('Erro desconhecido. Tente novamente mais tarde.');
      }
    } catch (err) {
      const status = err.response?.status;
      const mensagemErro = err.response?.data?.error;
      if (status === 401) {
        setError('Usuário ou senha incorretos.');
      } else if (status === 500) {
        setError('Erro interno no servidor. Tente novamente mais tarde.');
      } else if (mensagemErro === 'Usuário não encontrado') {
        setError('E-mail ou usuário não encontrado. Verifique os dados ou cadastre-se.');
      } else if (mensagemErro === 'Senha incorreta') {
        setError('Senha incorreta.');
      } else {
        setError('Erro ao tentar fazer login. Por favor, tente novamente.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/image.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Usuário ou E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={!mostrarSenha}
      />
      <TouchableOpacity onPress={() => setMostrarSenha(s => !s)}>
        <Text style={styles.toggle}>{mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.buttonText}>Cadastrar-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3eaf6',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#174ea6',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#dcdfe6',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#174ea6',
    padding: 14,
    borderRadius: 22,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: '#b3d8fd',
    padding: 14,
    borderRadius: 22,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#e74c3c',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  toggle: {
    color: '#174ea6',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default LoginScreen;
