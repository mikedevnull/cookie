# base node image
FROM node:18-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
#RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /cookie

ADD package.json  ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /cookie

COPY --from=deps /cookie/node_modules /cookie/node_modules
ADD package.json  ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /cookie

COPY --from=deps /cookie/node_modules /cookie/node_modules

#ADD prisma .
#RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /cookie

COPY --from=production-deps /cookie/node_modules /cookie/node_modules
#COPY --from=build /cookie/node_modules/.prisma /cookie/node_modules/.prisma

COPY --from=build /cookie/build /cookie/build
COPY --from=build /cookie/public /cookie/public
ADD . .

CMD ["npm", "start"]