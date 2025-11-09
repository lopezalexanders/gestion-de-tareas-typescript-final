# DevPro Tasks

MVP de una plataforma de gestión de tareas orientada a equipos de desarrollo. El proyecto consta de una API REST construida con TypeScript/Express y un frontend en React + Vite que consumen un contrato OpenAPI compartido. Esta guía explica cómo preparar el entorno de desarrollo, ejecutar los servicios y aprovechar los scripts principales.

## Tabla de contenidos
- [Arquitectura](#arquitectura)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Configuración rápida](#configuración-rápida)
- [Ejecución de servicios](#ejecución-de-servicios)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Scripts útiles](#scripts-útiles)
- [Base de datos](#base-de-datos)
- [Variables de entorno](#variables-de-entorno)
- [Uso con Docker](#uso-con-docker)
- [Pruebas y calidad](#pruebas-y-calidad)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Contrato OpenAPI](#contrato-openapi)
- [Resolución de problemas](#resolución-de-problemas)

## Arquitectura

El sistema se organiza en dos paquetes principales:

- **backend/** – API REST en Express con persistencia SQLite mediante Prisma.
- **frontend/** – Aplicación React que consume los endpoints expuestos por la API.

La raíz del repositorio contiene scripts compartidos y el archivo `docker-compose.yml` para levantar ambos servicios simultáneamente.

## Stack tecnológico

| Capa | Tecnologías |
| --- | --- |
| Backend | Node.js 20, TypeScript, Express, Prisma, SQLite |
| Frontend | React 18, Vite, TypeScript, React Query |
| DevOps | Docker, Docker Compose |
| Testing | Vitest, Testing Library, ESLint |

## Requisitos previos

- Node.js 20+
- npm 10+
- Docker (opcional, para ejecución contenedorizada)

## Configuración rápida

Instala las dependencias raíz y de cada workspace:

```bash
npm install --workspaces=false
(cd backend && npm install)
(cd frontend && npm install)
```

## Ejecución de servicios

### Backend

```bash
cd backend
npm run migrate
npm run dev
```

La API se expone en `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm run dev
```

La aplicación web estará disponible en `http://localhost:5173`.

## Scripts útiles

| Comando | Descripción |
| --- | --- |
| `npm run lint --workspaces` | Ejecuta ESLint en frontend y backend |
| `npm run test --workspaces` | Lanza la suite de Vitest en ambos proyectos |
| `npm run build --workspaces` | Genera builds de producción |

## Base de datos

El backend utiliza SQLite por defecto. Los archivos de la base de datos se crean dentro de `backend/prisma/devpro.db`. Para reiniciar el estado:

```bash
cd backend
rm prisma/devpro.db
npm run migrate
```

## Variables de entorno

El backend admite la configuración mediante un archivo `.env`. Los valores más relevantes son:

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión utilizada por Prisma. Por defecto apunta a SQLite local. |
| `PORT` | Puerto en el que se expone la API (`3000` por defecto). |

En el frontend, puedes definir variables en `.env` siguiendo el prefijo `VITE_`, por ejemplo `VITE_API_BASE_URL`.

## Uso con Docker

La configuración de Docker Compose levanta backend y frontend conectados:

```bash
docker-compose build
docker-compose up
```

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Detén los contenedores con `docker-compose down`.

## Pruebas y calidad

Ejecuta las pruebas unitarias e integradas con Vitest y analiza el código con ESLint:

```bash
npm run test --workspaces
npm run lint --workspaces
```

## Estructura del repositorio

```
.
├── backend/          # API REST con Express + Prisma
├── frontend/         # Aplicación React + Vite
├── docker-compose.yml
├── package.json      # Scripts y configuración compartida
└── Especificacion_SDD_IA_DevPro_Tasks.md
```

## Contrato OpenAPI

La especificación de la API se encuentra en `backend/openapi/devpro-tasks.yaml`. Úsala para generar SDKs o documentar integraciones.

## Resolución de problemas

- **La API no arranca tras una migración**: verifica que `DATABASE_URL` apunta al archivo SQLite correcto y elimina la base si es necesario.
- **El frontend no ve la API**: confirma que `VITE_API_BASE_URL` coincide con la URL publicada por el backend y que no hay bloqueos CORS.
- **Errores de dependencias**: asegúrate de instalar las dependencias en la raíz y en cada workspace antes de ejecutar scripts.

¡Listo! Con esta guía deberías poder trabajar en el MVP y extenderlo según tus necesidades.
