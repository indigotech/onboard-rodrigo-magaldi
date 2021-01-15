# Onboarding Taqtile - Rodrigo Magaldi

## Description

Nodejs GraphQL [Apollo server](https://www.apollographql.com/docs/apollo-server/). [PostgreSQL](https://www.postgresql.org/about/) database managed by [typeORM](https://typeorm.io/#/) runs on a [docker](https://www.docker.com/) container.

## Environment and tools

- [Typescript](https://www.npmjs.com/package/typescript) v4.1.3
- [nodeJS](https://nodejs.org/en/) v12.17.0
- [apollo-server](https://www.apollographql.com/docs/apollo-server/) v2.19.1
- [typeORM](https://typeorm.io/#/)
- [docker](https://www.docker.com/) v20.10.2
- [PostgreSQL](https://www.postgresql.org/about/)

Dev Tools:

- [ESLint](https://www.npmjs.com/package/eslint)
- [Prettier](https://www.npmjs.com/package/prettier)

Both **ESLint** and **Prettier** are being used according to this [template](https://github.com/indigotech/template-node)'s config files.

## Steps to run and debug

In order to run this project, **first** check if you have **nodeJS** properly installed on your machine by typing `node -v` into a terminal. Also make sure your **docker** instalation is OK by typing `docker -v`.

1. Clone the project. `git clone https://github.com/indigotech/onboard-rodrigo-magaldi.git`
2. Install the dependencies. `yarn`
3. Run `docker-compose up -d` on the root folder to start the container in detached mode.
4. Type `yarn dev:server` to run the server. Auto-reload is on (with ts-node-dev).
