# Auth Service

Microserviço de autenticação e autorização para desenvolvedores.

## Tecnologias
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt

## Endpoints
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- GET /auth/me

## Estrutura Sugerida
- src/domain: entidades e interfaces
- src/application: casos de uso
- src/infrastructure: repositórios, JWT, Prisma
- src/presentation: controllers, rotas

## Como rodar
1. Instale as dependências: `npm install`
2. Configure o banco de dados no arquivo `.env`
3. Rode as migrations: `npx prisma migrate dev`
4. Inicie o serviço: `npm run dev`

## Testes
- Execute `npm test` para rodar os testes unitários e de integração.

## Documentação
- Endpoints documentados em `/docs` (Swagger ou Markdown)
