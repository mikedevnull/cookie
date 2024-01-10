# Step 1: Build the page
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
WORKDIR /app/frontend
COPY ./frontend/package.json  ./
RUN npm ci 

COPY frontend .

RUN npm run build 

# Step 2: Set up nestjs to server static page
FROM node:20-alpine as backend
RUN apk add --no-cache tini

WORKDIR /app
COPY package.json package-lock.json ./
WORKDIR /app/backend
COPY ./backend/package.json  ./
RUN npm ci 

COPY backend .
RUN npm run build 

COPY --from=builder /app/frontend/dist /app/frontend



EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "/app/backend/dist/main.js"]