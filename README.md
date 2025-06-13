# Agile Dev - Monorepo

![Logo](web/public/logo.png)

Plataforma completa para gestão ágil de times, tarefas, cerimônias, user stories, sprints e relatórios, baseada em arquitetura de microserviços ou monolito e frontend moderno.

---

## 🏗️ Visão Geral

Este monorepo contém:
- **Frontend**: Aplicação Next.js responsiva e moderna
- **API Gateway**: Roteamento centralizado e autenticação (microserviços)
- **Auth Service**: Autenticação e autorização de usuários (microserviços)
- **Scrum Service**: Gestão de tarefas, user stories, sprints, trimestres e cerimônias (microserviços)
- **Report Service**: Relatórios e exportação de dados (microserviços)
- **Monolithic API**: Versão unificada da API, integrando todos os domínios em um único serviço

---

## 📦 Estrutura do Projeto

```
api/
  microservices/
    auth-service/
    gateway/
    report-service/
    scrum-service/
  monolithic/
web/
```

---

## 🚀 Como rodar tudo localmente

### Microserviços

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

### Monolito

1. Instale as dependências:
   ```sh
   cd api/monolithic
   npm install
   ```
2. Execute as migrações do banco:
   ```sh
   npx prisma migrate dev
   ```
3. Rode a API:
   ```sh
   npm run dev
   ```
4. Acesse: [http://localhost:4010](http://localhost:4010)

---

## 🧩 Serviços, Integração e Monolito

- **API Gateway**: Porta 4000 (centraliza todas as requisições)
- **Auth Service**: Porta 4001 (login, registro, autenticação)
- **Scrum Service**: Porta 4002 (tarefas, user stories, sprints, cerimônias)
- **Report Service**: Porta 4003 (relatórios e exportação)
- **Monolithic API**: Porta 4010 (tudo unificado)
- **Frontend**: Porta 3000 (Next.js)

Todos os serviços se comunicam via HTTP REST, com autenticação JWT.

---

## 🖼️ Fluxo Geral da Plataforma

1. Usuário acessa o frontend e realiza login/cadastro
2. Frontend consome API Gateway ou Monolito, que roteia para os domínios
3. Auth Service/Monolito valida autenticação
4. Scrum Service/Monolito gerencia dados ágeis
5. Report Service/Monolito gera relatórios sob demanda

---

## 📚 Documentação de cada serviço

- [Frontend (web/README.md)](./web/README.md)
- [API Gateway](./api/microservices/gateway/README.md)
- [Auth Service](./api/microservices/auth-service/README.md)
- [Scrum Service](./api/microservices/scrum-service/README.md)
- [Report Service](./api/microservices/report-service/README.md)
- [Monolithic API](./api/monolithic/README.md)

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
