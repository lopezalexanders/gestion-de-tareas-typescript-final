# DevPro Tasks – MVP

Este repositorio contiene el código base del MVP "DevPro Tasks" construido siguiendo la especificación `Especificacion_SDD_IA_DevPro_Tasks.md`. Incluye una API REST en TypeScript/Express con persistencia SQLite y un frontend React + Vite.

## Requisitos previos
- Node.js 20+
- npm 10+
- Docker (opcional, para ejecución contenedorizada)

## Instalación rápida

```bash
npm install --workspaces=false
(cd backend && npm install)
(cd frontend && npm install)
```

### Backend

```bash
cd backend
npm run migrate
npm run dev
```

La API estará disponible en `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm run dev
```

La interfaz estará disponible en `http://localhost:5173`.

## Scripts útiles

| Comando | Descripción |
| --- | --- |
| `npm run lint --workspaces` | Ejecuta ESLint en frontend y backend |
| `npm run test --workspaces` | Ejecuta Vitest en ambos proyectos |
| `npm run build --workspaces` | Genera builds de producción |

## Docker

```bash
docker-compose build
docker-compose up
```

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## OpenAPI
La definición de contrato se encuentra en `backend/openapi/devpro-tasks.yaml`.
