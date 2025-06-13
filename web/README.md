# Frontend - Scrum App

![Logo](public/logo.png)

Aplicação web desenvolvida em Next.js para gestão de times ágeis, tarefas, cerimônias, user stories, sprints e relatórios.

---

## 🚀 Funcionalidades

- Autenticação de usuários (login, registro, logout)
- Dashboard com visão geral
- Gestão de tarefas, user stories, sprints, trimestres e cerimônias
- Relatórios visuais e exportação
- Configurações de usuário
- Interface responsiva e dark mode

---

## 📊 Estrutura de Telas

- **/auth/register**: Cadastro de usuário
- **/auth**: Login
- **/dashboard**: Visão geral
- **/dashboard/tasks**: Gerenciamento de tarefas
- **/dashboard/user-stories**: User stories
- **/dashboard/ceremonies**: Cerimônias Scrum
- **/dashboard/trimesters**: Trimestres e Sprints
- **/dashboard/reports**: Relatórios
- **/dashboard/settings**: Configurações do usuário

---

## 🖼️ Fluxo de Navegação

1. Usuário acessa a tela de login ou cadastro
2. Após autenticação, é redirecionado ao dashboard
3. Navega entre tarefas, user stories, cerimônias, sprints, relatórios e configurações
4. Pode sair a qualquer momento pelo menu lateral

---

## ⚙️ Como rodar localmente

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Configure as variáveis de ambiente em `.env.local`:
   ```env
   NEXT_PUBLIC_GATEWAY_URL=http://localhost:4000
   ```
3. Inicie o frontend:
   ```sh
   npm run dev
   ```
4. Acesse [http://localhost:3000](http://localhost:3000)

---

## 🧩 Integração com Microserviços

- **API Gateway**: Todas as requisições passam pelo gateway (`NEXT_PUBLIC_GATEWAY_URL`)
- **Auth Service**: Autenticação e dados do usuário
- **Scrum Service**: Tarefas, user stories, sprints, cerimônias
- **Report Service**: Relatórios e exportação

---

## 📝 Observações
- O token JWT é salvo no sessionStorage e enviado automaticamente nas requisições.
- O frontend utiliza React Query, Zod, React Hook Form, TailwindCSS, Radix UI e outros.
- Para customização visual, edite `tailwind.config.ts` e `globals.css`.

---

## 👨‍💻 Contribuição
Pull requests são bem-vindos!

---

## 📄 Licença
MIT
