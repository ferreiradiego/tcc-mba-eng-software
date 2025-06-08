# TimeLog Service

Microserviço responsável pelo registro de tempo gasto em tarefas pelos usuários.

## Endpoints
- POST /timelogs/start
- POST /timelogs/pause
- POST /timelogs/resume
- POST /timelogs/stop
- GET /timelogs
- PUT /timelogs/:id

## Funcionalidades
- Início, pausa, retomada e fim do registro de tempo
- Edição manual do tempo
- Associação de registros de tempo às tarefas

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
