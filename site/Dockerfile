FROM node:16.3-alpine3.12 AS base
WORKDIR /base
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
ENV NODE_ENV=production
RUN npm set progress=false && \
  npm install -g expo-cli
RUN yarn build-web

FROM nginx:latest
COPY --from=base /base/web-build /usr/share/nginx/html
