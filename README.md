This is a Library Management System built using Next.js, designed to efficiently manage and automate the various processes and tasks associated with library operations.

Data is stored in a Postgres Database (through [Prisma](https://www.prisma.io/)) running in a Docker container. Note that the [.env](/.env) file holds the database URL.

Auth is done using [NextAuth (v5)](https://authjs.dev/), validation using [zod](https://zod.dev/). 

## Setup

First, run the database server:

```bash
docker compose up -d
```

This installs the [PostgreSQL Image](https://hub.docker.com/_/postgres) and spins up a container with a volume.

Next, set up the database by running migrations, and start the development server: 

```bash
pnpm exec prisma migrate dev
pnpm dev
```

This will also seed the database with random values using [Faker.js](https://fakerjs.dev/), and starts a server listening at [http://localhost:3000](http://localhost:3000).

Login using:

```
id:         server
password:   password
```
