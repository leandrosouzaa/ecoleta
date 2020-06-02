

## Anotações

- Rotas 
  - Endereço completo da aplicação;
  - As rotas são semânticas
  - Recurso: Qual entidade estamos acessando do sistema;

- Tipos de Requisições: 
  - GET    Buscar informações;
  - POST   Criar uma nova informação;
  - PUT    Atualizar uma informação já existente;
  - DELETE Remover uma informação

- Exemples de rotas e tipos de requisições
  - POST http://localhost:3333/users => Cria um novo usuário;
  - GET  http://localhost:3333/users => Lista todos os usuários;
  - GET  http://localhost:3333/users/1 => Lista o usuário com ID 1;
  - PUT  http://localhost:3333/users/1 => Edita o usuário com ID 1;