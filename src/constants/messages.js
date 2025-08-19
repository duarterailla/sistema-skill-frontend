// Mensagens centralizadas para uso em todo o frontend
const MESSAGES = {
  // Erros gerais
  sessionExpired: 'Sessão expirada. Faça login novamente.',
  loadError: 'Erro ao carregar os dados. Por favor, tente novamente.',
  addError: 'Erro ao adicionar skill. Tente novamente.',
  duplicateSkill: 'Você já possui esta skill.',
  updateError: 'Erro ao atualizar o nível. Tente novamente.',
  deleteError: 'Erro ao excluir a skill. Tente novamente.',
  missingFields: 'Preencha todos os campos obrigatórios.',
  invalidUrl: 'Por favor, insira uma URL de imagem válida.',
  profileSaveError: 'Erro ao salvar informações pessoais. Tente novamente.',
  profileLoadError: 'Erro ao carregar o perfil. Por favor, tente novamente.',
  emailExists: 'E-mail ou usuário já cadastrado! Por favor, tente novamente com outros dados.',

  // Login
  incorrectPassword: 'Senha incorreta.',
  incorrectUser: 'Usuário ou e-mail incorreto.',

  // Sucesso
  skillAdded: 'Skill adicionada com sucesso!',
  skillDeleted: 'Skill excluída com sucesso!',
  profileSaved: 'Perfil salvo com sucesso!'
};

export default MESSAGES;
