# syntax=docker/dockerfile:1

# ---------- Stage 1: build ----------
# Compiles TypeScript to JavaScript using full (dev) dependencies.
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ---------- Stage 2: production ----------
# Ships only the compiled output and production dependencies.
# No .env file, credentials or source (.ts) files are copied into this image:
# runtime configuration is injected exclusively via environment variables
# (see docker-compose.yml / .env.example).
FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3001

CMD ["node", "dist/main.js"]
