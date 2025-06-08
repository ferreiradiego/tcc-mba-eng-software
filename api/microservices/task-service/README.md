# Task Service

Microserviço responsável pelo gerenciamento de tarefas dos usuários.

## Endpoints
- POST /tasks
- GET /tasks
- GET /tasks/:id
- PUT /tasks/:id
- DELETE /tasks/:id

## Funcionalidades
- CRUD de tarefas
- Categorizar, priorizar e atribuir tarefas
- Definir prazos e dependências

## Estrutura Sugerida
- src/domain: entidades e interfaces
- src/application: casos de uso
- src/infrastructure: repositórios, Prisma
- src/presentation: controllers, rotas

## Como rodar
1. Instale as dependências: `npm install`
2. Configure o banco de dados no arquivo `.env`
3. Rode as migrations: `npx prisma migrate dev`
4. Inicie o serviço: `npm run dev`
