# Stage 1: Development
FROM node:20-alpine AS dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# This command will only be used in dev
CMD ["npm", "run", "dev"]

# Stage 2: Production build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 3: Production server (Nginx)
FROM nginx:stable-alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]