FROM node:16.3-alpine3.12 AS base
WORKDIR /base
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
ENV NODE_ENV=production
CMD npx serve web-build
