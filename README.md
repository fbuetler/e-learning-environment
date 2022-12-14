# bsc-thesis

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Run unit tests

```
yarn test:unit
```

### Run e2e tests

When development server is already running

```
yarn test:e2e --url http://localhost:8080 --headless
```

else

```
yarn test:e2e --headless
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Run production build in docker container

### Build

```
docker build . -t bsc-thesis -f deployment/Dockerfile
```

### Run

```
docker run -p 8081:80 bsc-thesis
```

### Count words in the thesis report

```
texcount thesis.tex -inc -merge -total
```
