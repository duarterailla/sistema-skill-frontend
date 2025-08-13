# ProjetoNeki - Frontend Web

Sistema de gestão de skills desenvolvido em **React**, com autenticação JWT e integração completa com backend RESTful.

## ✨ Funcionalidades

- Autenticação de usuários (login e cadastro)
- Tela Home protegida (acesso apenas para usuários autenticados)
- Listagem, adição, edição e exclusão de skills do usuário
- Modal dinâmico para adicionar skills existentes ou cadastrar novas
- Download de skills em PDF
- Integração total com backend (endpoints `/api/auth`, `/api/skills`, `/api/user-skills`)
- Layout moderno, responsivo e acessível

## 🛠 Tecnologias Utilizadas

- React 18+
- React Router DOM
- Axios
- CSS moderno e responsivo
- Vite

## 🚀 Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git
   cd frontend-web
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure a URL do backend:**
   - Edite o arquivo `src/services/api.js` e ajuste a propriedade `baseURL` para o endereço do seu backend.

4. **Inicie o projeto:**
   ```bash
   npm run dev
   ```
   O app estará disponível em [http://localhost:5173](http://localhost:5173) (ou na porta definida pelo Vite).

## 📁 Estrutura de Pastas

```
src/
  assets/         # Imagens, ícones, etc.
  components/     # Componentes reutilizáveis (ex: Modal)
  hooks/          # Custom hooks (ex: useAuth, useStorage)
  pages/          # Telas principais (Login, Cadastro, Home, Perfil)
    Home/
      components/ # Componentes específicos da Home
  routes/         # Rotas e proteção de rotas
  services/       # Serviços de API (auth, skills, categorias)
  utils/          # Funções utilitárias (PDF, imagens, validações)
  App.jsx         # Componente principal
  main.jsx        # Ponto de entrada
```

## 🔗 Endpoints esperados do backend

- **Autenticação**
  - `POST /api/auth/register` — Cadastro de usuário
  - `POST /api/auth/login` — Login (retorna token JWT e userId)
- **Skills**
  - `GET /api/skills` — Listar todas as skills
- **Skills do Usuário**
  - `GET /api/user-skills/{userId}` — Listar skills do usuário
  - `POST /api/user-skills` — Associar skill a usuário
  - `PUT /api/user-skills/{userSkillId}` — Atualizar nível da skill
  - `DELETE /api/user-skills/{userSkillId}` — Remover skill do usuário
  - `GET /api/user-skills/{userId}/pdf` — Baixar skills do usuário em PDF

## ⚡ Observações

- O token JWT é salvo no localStorage e enviado automaticamente nas requisições protegidas.
- O projeto está pronto para deploy em serviços como Vercel, Netlify, etc.
- Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Aproveite o projeto!** 🚀
