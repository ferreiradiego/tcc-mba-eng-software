# Scrum Ceremony Service

Microserviço responsável pelo gerenciamento e registro de tempo em cerimônias Scrum.

## Endpoints
- POST /ceremonies
- GET /ceremonies
- POST /ceremonies/:id/participate
- POST /ceremonies/:id/timelog

## Funcionalidades
- Agendamento e notificação de cerimônias
- Registro automático da participação
- Associação de registros de tempo às cerimônias

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
