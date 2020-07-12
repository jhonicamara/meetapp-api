<h1 align="center">
	<img alt="MeetUp" src=".github/logo.svg" width="140px" />
</h1>

<h3 align="center">
  <b>Backend MeetUp</b>
</h3>


<p align="center">
  <a href="#-Sobre-o-projeto">Sobre o projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-Tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Executando o projeto</a>
</p>


## 💇🏻‍♂️ Sobre o projeto

Esta api entrega o que é necessário para organizar meetups.

Os usuários no aplicativo podem verificar a agenda de meetups e se inscreverem.

Os usuários na página web podem cadastrar, editar e deletar meetups.

Esta api também realiza envio de emails!!! Notificando os usuários sobre novas inscrições nos seus meetups.

Veja também o **frontend**, clique aqui: [MeetApp Frontend](https://github.com/jhonicamara/meetapp-web)<br />
Veja também o **mobile**, clique aqui: [MeetApp Mobile](https://github.com/jhonicamara/meetapp-mobile)

## 🚀 Tecnologias

Tecnologias que utilizei para desenvolver esta api

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Multer](https://github.com/expressjs/multer)
- [JWT-token](https://jwt.io/)
- [Sequelize](https://sequelize.org/master/)
- [PostgreSQL](https://www.postgresql.org/)
- [Date-fns](https://date-fns.org/)
- [Bee Queue](https://github.com/bee-queue/bee-queue)
- [Nodemailer](https://nodemailer.com/about/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [EditorConfig](https://editorconfig.org/)

## 💻 Executando o projeto

Adicione o arquivo `Insomnia.json` no aplicativo Insomnia, para testar as rotas

### Requisitos

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- Um instância do [PostgreSQL](https://www.postgresql.org/)

**Faça o clone do projeto e acesse a pasta**

```bash
$ git clone https://github.com/jhonicamara/meetup-api.git meetapp-api && cd meetapp-api
```

**Siga os passos a seguir**

```bash
# Instale as dependências
$ yarn

# Crie uma instancia do postgreSQL usando docker
$ docker run --name meetapp-postgres -e POSTGRES_USER=docker \
              -e POSTGRES_DB=meetapp -e POSTGRES_PASSWORD=docker \
              -p 5432:5432 -d postgres

# Crie uma instancia do redis usando docker
$ docker run --name meetapp-redis -p 6379:6379 -d -t redis:alpine

# Copie o arquivo '.env.example' e o renomeie para '.env' depois adicione os valores das variaveis ambiente.
$ cp .env.example .env

# Quando todos serviçoes estiverem rodando, execute as migrations, na pasta do projeto.
$ yarn sequelize db:migrate

# Inicie a api, na pasta do projeto
$ yarn server

# Inicie a fila de envio de emails
$ yarn queue

# Pronto, projeto funcionando!
```
---

Feito por João Câmara 👋 [Veja meu Linkedin](https://www.linkedin.com/in/jo%C3%A3o-c%C3%A2mara-565b42184/)
