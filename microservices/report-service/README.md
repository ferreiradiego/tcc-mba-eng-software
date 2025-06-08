# Report Service

Microserviço responsável pela geração de relatórios personalizados sobre o tempo gasto em tarefas, cerimônias e outras atividades.

## Endpoints
- GET /reports/tasks
- GET /reports/ceremonies
- GET /reports/summary
- GET /reports/export?format=pdf|csv

## Funcionalidades
- Filtragem por período, categoria, projeto e usuário
- Exportação em PDF/CSV
- Métricas e gráficos

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
