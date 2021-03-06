

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

- Tipos de Parâmetros: 
  - Body : 
  - Query: Parâmetros que vem na própria rota, normalmente opcionais e utilizados para filtros e paginação.
  - Param: Parâmetros que vem na própria rota que identifica um recurso;

- Banco de Dados
  - SQLite3;
  - Tabelas:
    - points (Pontos de Coleta):
      - image;
      - name;
      - email;
      - whatsapp;
      - latitude;
      - longitude;
      - city;
      - uf;
    - items (Items de coleta):
      - image;
      - title;
    - point_items (Relacionamento de itens que um ponto coleta):
      - point_id;
      - item_id
  - Migrations: Maneira para controle de versão do banco de dados;