FROM node:12.13-buster as build
WORKDIR /app
COPY ./package*.json ./
RUN yarn
COPY ./ ./
RUN yarn build

FROM nginx
WORKDIR /app
COPY --from=build /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
