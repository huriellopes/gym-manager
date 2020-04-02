# Gym Manager

> Gerenciador de Academias do curso LaunchBase, feita com o intuito de cadastros de professores e membros da academia!

### Funcionalidades
 1. Instrutores
    - Cadastro
    - Listagem
    - Paginação
    - Filtro
    - Edição
    - Exlusão
 2. Membros
    - Cadastro
    - Listagem
    - Paginação
    - Filtro
    - Edição
    - Exlusão

### Tecnologias
  - NodeJs
  - Express
  - Nunjucks
  - Moment
  - npm-run-all
  - nodemon
  - browser-sync
  - method-override

### Para testar a aplicação, você terá que seguir o passo a passo abaixo:

#### Baixar o postgreSQL
> Você pode seguir o passo a passo do instrutor Mayk Brito, conforme o seu SO:
https://github.com/Rocketseat/bootcamp-launchbase-05/blob/master/docs/guia-instalacao-postgres.md

> Em seguida de instalado o banco de dados, crie um schema chamado **gymmanager**

#### Criação das tabelas no schema **gymmanager**

> Estrutura das tabelas:

##### Lembrando que na hora de criar as tabelas, já vem com o id auto_increment e primary key!

```
  instructors
    avatar_url text null,
    name text null,
    birth date null,
    gender text null,
    services text null,
    created_at timestamp null
```

```
  members
    avatar_url,
    name text null,
    email text null,
    birth date null,
    gender text null,
    blood text null,
    weight text null,
    height text null,
    instructor_id integer null,
    created_at timestamp null
```

#### Configurar a conexão com o banco de dados

>No arquivo src/config/db.js

```
  user: usuario,
  password: senha,
  host: localhost,
  port: 5432,
  database: 'gymmanager'
```
#### Depois de ter instalado o banco e feito a criação do schema, e configurado as credenciais no arquivo de conexão, vamos startar a aplicação para que possamos testa-lá!

> comando de start

```
  npm start
```

> Aguarde um momento que irá abrir uma janela com o seguinte endereço: http://localhost:3000

### ScreenShot

  - Tela de Listagem de Instrutores
    ![](/screenshot/instrutores.png)
  
  - Tela de Cadastro de instrutor
    ![](/screenshot/cadastro-instrutor.png)

  - Tela de Detalhes do instrutor
    ![](/screenshot/detalhe-instrutor.png)

  - Tela de Edição de instrutor
    ![](/screenshot/edita-instrutor.png)

  - Tela de Listagem de membros
    ![](/screenshot/membros.png)

  - Tela de Cadasro de membro
    ![](/screenshot/cadastro-membro.png)

  - Tela de Detalhes do membro
    ![](/screenshot/detalhe-membro.png)

  - Tela de Edição de membro
    ![](/screenshot/edita-membro.png)

 
### Créditos
  - RocketSeat
  - Instrutor: Mayk Brito