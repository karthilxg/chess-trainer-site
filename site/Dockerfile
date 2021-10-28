FROM node:16.3-alpine3.12 AS base
WORKDIR /base
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
ENV NODE_ENV=production
RUN npm set progress=false && \
  npm install -g expo-cli
WORKDIR /base/packages/next
RUN next export

FROM nginx:latest
# RUN rm -rf /etc/nginx
# COPY nginx /etc/nginx
COPY templates /etc/nginx/templates/
COPY --from=base /base/packages/next/out /usr/share/nginx/html
