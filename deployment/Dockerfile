FROM node:15.6-buster as build
WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn
COPY ./ ./
RUN yarn build

FROM nginx
WORKDIR /app
COPY --from=build /app/dist /app
COPY ./deployment/nginx.conf /etc/nginx/nginx.conf
