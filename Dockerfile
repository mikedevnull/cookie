# Step 1: Build the page
FROM node:lts-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
WORKDIR /app/packages/frontend
COPY ./packages/frontend/package.json  ./
RUN npm ci 

COPY packages/frontend .

RUN npm run build 

# Step 2: Set up nestjs to server static page
FROM node:lts-alpine as backend
RUN apk add --no-cache tini

WORKDIR /app
COPY package.json package-lock.json ./
WORKDIR /app/packages/backend
COPY ./packages/backend/package.json  ./
RUN npm ci 

COPY packages/backend .
RUN npm run build 

COPY --from=builder /app/packages/frontend/dist /app/frontend



EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "/app/backend/dist/main.js"]