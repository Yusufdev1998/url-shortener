# URL Shortener

A full-stack, professional-grade URL shortener application with analytics and link management features. Built with NestJS, React, TypeScript, and PostgreSQL. Easily run locally or in production using Docker Compose.

---

## Features

- **Shorten URLs** with custom aliases (up to 20 characters)
- **Advanced analytics:** Track click counts, IP addresses, and more
- **Expiry control:** Set expiration dates for links
- **Link management:** View and manage all your short links
- **Modern UI:** Responsive, accessible, and beautiful interface
- **Fully Dockerized:** Easy local development and production deployment

---

## Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS, Radix UI
- **Backend:** NestJS, TypeScript, TypeORM
- **Database:** PostgreSQL (Dockerized)
- **Other:** Docker, Docker Compose, Makefile

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- (Optional for local dev) [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/)

### Quick Start (Production)

```bash
make prod
```
- The frontend will be available at [http://localhost:8080](http://localhost:8080)
- The backend API will be at [http://localhost:3000](http://localhost:3000)

### Development Mode

```bash
make dev
```
- Hot-reloads both frontend and backend for development.

### Stopping Services

```bash
make stop
```

### Database Access

```bash
make psql
```
- Opens a psql shell to the running PostgreSQL container.

### Clean Up (Removes DB Data!)

```bash
make clean
```

---

## Project Structure

```
url-shortener/
  backend/    # NestJS API (TypeScript)
  frontend/   # React app (Vite + TypeScript)
  docker-compose.yml
  Makefile
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in required values (DB credentials, etc). See `docker-compose.yml` for required variables.

---

## Development (Manual)

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## License

This project is currently **UNLICENSED**. See `backend/package.json` for details.

---

## Credits

- Built with [NestJS](https://nestjs.com/) and [React](https://react.dev/)
- UI powered by [TailwindCSS](https://tailwindcss.com/) and [Radix UI](https://www.radix-ui.com/)

