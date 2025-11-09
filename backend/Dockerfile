# syntax=docker/dockerfile:1.6
FROM node:20-slim AS base
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/openapi ./openapi
COPY --from=base /app/data ./data
CMD ["node", "dist/server.js"]
