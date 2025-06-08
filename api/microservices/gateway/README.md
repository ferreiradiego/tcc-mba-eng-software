# API Gateway

Gateway responsável por rotear as requisições entre os microserviços, centralizando autenticação, autorização e agregação de dados.

## Funcionalidades
- Roteamento de requisições para os microserviços
- Validação de autenticação JWT
- Agregação de respostas (quando necessário)
- Possível implementação de rate limiting, logging, etc.

## Estrutura Sugerida
- src/routes: rotas para cada microserviço
- src/middleware: autenticação, logging, etc.
- src/main.ts: ponto de entrada

## Como rodar
1. Instale as dependências: `npm install`
2. Configure as URLs dos microserviços no arquivo `.env`
3. Inicie o gateway: `npm run dev`
