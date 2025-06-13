# Scrum App - Monorepo

![Logo](web/public/logo.png)

Plataforma completa para gestão ágil de times, tarefas, cerimônias, user stories, sprints e relatórios, baseada em arquitetura de microserviços e frontend moderno.

---

## 🏗️ Visão Geral

Este monorepo contém:
- **Frontend**: Aplicação Next.js responsiva e moderna
- **API Gateway**: Roteamento centralizado e autenticação
- **Auth Service**: Autenticação e autorização de usuários
- **Scrum Service**: Gestão de tarefas, user stories, sprints, trimestres e cerimônias
- **Report Service**: Relatórios e exportação de dados

---

## 📦 Estrutura do Projeto

```
api/
  microservices/
    auth-service/
    gateway/
    report-service/
    scrum-service/
web/
```

---

## 🚀 Como rodar tudo localmente

1. **Clone o repositório e acesse a pasta raiz**
2. Instale as dependências de cada serviço e do frontend:
   ```sh
   cd api/microservices/auth-service && npm install
   cd ../scrum-service && npm install
   cd ../report-service && npm install
   cd ../gateway && npm install
   cd ../../../..
   cd web && npm install
   cd ..
   ```
3. Configure os arquivos `.env` de cada serviço e `.env.local` do frontend conforme exemplos fornecidos.
4. Rode os bancos/migrations de cada serviço backend:
   ```sh
   # Exemplo para cada serviço
   cd api/microservices/auth-service && npx prisma migrate dev
   # Repita para scrum-service e report-service
   ```
5. Inicie todos os serviços (pode usar múltiplos terminais ou Docker Compose):
   ```sh
   # Exemplo manual
   cd api/microservices/auth-service && npm run dev
   cd ../scrum-service && npm run dev
   cd ../report-service && npm run dev
   cd ../gateway && npm run dev
   cd ../../../..
   cd web && npm run dev
   ```
---

## 🧩 Microserviços e Integração

- **API Gateway**: Porta 4000 (centraliza todas as requisições)
- **Auth Service**: Porta 4001 (login, registro, autenticação)
- **Scrum Service**: Porta 4002 (tarefas, user stories, sprints, cerimônias)
- **Report Service**: Porta 4003 (relatórios e exportação)
- **Frontend**: Porta 3000 (Next.js)

Todos os serviços se comunicam via HTTP REST, com autenticação JWT.

---

## 🖼️ Fluxo Geral da Plataforma

1. Usuário acessa o frontend e realiza login/cadastro
2. Frontend consome API Gateway, que roteia para os microserviços
3. Auth Service valida autenticação
4. Scrum Service gerencia dados ágeis
5. Report Service gera relatórios sob demanda

---

## 📚 Documentação de cada serviço

- [Frontend (web/README.md)](./web/README.md)
- [API Gateway](./api/microservices/gateway/README.md)
- [Auth Service](./api/microservices/auth-service/README.md)
- [Scrum Service](./api/microservices/scrum-service/README.md)
- [Report Service](./api/microservices/report-service/README.md)

Cada serviço possui instruções detalhadas, exemplos de uso e collections do Postman.

---

## 📝 Observações
- O token JWT é salvo no sessionStorage do frontend e enviado automaticamente nas requisições.
- O sistema utiliza Next.js, React Query, Zod, React Hook Form, TailwindCSS, Prisma, Radix UI, JWT, Docker e mais.
- Para customização visual, edite `web/tailwind.config.ts` e `web/src/app/globals.css`.

---

## 👨‍💻 Contribuição
Pull requests são bem-vindos!

---

## 📄 Licença
MIT
