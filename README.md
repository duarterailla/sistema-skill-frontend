<<<<<<< HEAD

# ProjetoNeki - Frontend Web

Sistema de gestão de skills para usuários, desenvolvido em ReactJS, com integração total ao backend via API REST.
=======
# ProjetoNeki - Frontend Web

Sistema de gestão de skills desenvolvido em **React**, com autenticação JWT e integração completa com backend RESTful.
>>>>>>> 75b9b479a453719b25ebf1ec8155f7004fe16684

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

<<<<<<< HEAD
=======
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

>>>>>>> 75b9b479a453719b25ebf1ec8155f7004fe16684
## 📁 Estrutura de Pastas

```
src/
<<<<<<< HEAD
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
=======
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
>>>>>>> 75b9b479a453719b25ebf1ec8155f7004fe16684
```

## 🔗 Endpoints esperados do backend

- **Autenticação**
<<<<<<< HEAD
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
- **Categorias**
	- `GET /api/categorias` — Listar categorias
- **Perfil do Usuário**
	- `GET /api/usuarios/{userId}` — Buscar dados do usuário
	- `PUT /api/usuarios/{userId}/info-pessoais` — Atualizar dados pessoais

## 🚀 Como rodar o projeto

1. Instale as dependências:
	 ```bash
	 npm install
	 ```
2. Inicie o servidor de desenvolvimento:
	 ```bash
	 npm run dev
	 ```
3. Acesse [http://localhost:5173](http://localhost:5173) no navegador.

## 💡 Dicas

- Certifique-se de que o backend está rodando e acessível na porta configurada em `src/services/api.js`.
- O projeto utiliza variáveis CSS para fácil customização de cores e temas.
- Para adicionar novas funcionalidades, crie componentes em `src/components` e hooks em `src/hooks`.
- Mensagens de erro e sucesso estão centralizadas em `src/constants/messages.js`.

## 📄 Licença

Este projeto é open-source e pode ser utilizado livremente para fins de estudo e aprimoramento.
=======
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

<img width="1918" height="1008" alt="image" src="https://github.com/user-attachments/assets/df700d5d-01e2-4eaa-adb7-59bcafb3a538" />
<img width="1918" height="1012" alt="image" src="https://github.com/user-attachments/assets/bc389696-6187-4c44-9ada-9e208085bd99" />


---

**Aproveite o projeto!** 🚀
>>>>>>> 75b9b479a453719b25ebf1ec8155f7004fe16684
