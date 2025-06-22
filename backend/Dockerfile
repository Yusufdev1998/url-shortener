# === Stage 1: Development ===
FROM node:20-alpine AS dev

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# === Stage 2: Build for Production ===
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# === Stage 3: Production runtime ===
FROM node:20-alpine AS prod

WORKDIR /app

# Copy built code and only production deps
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "dist/main"]