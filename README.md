# Bachelor Thesis @ ETH Zurich

This thesis is about a computer-based learning environment aimed for students at the 3rd and 4th grade level. It supports teachers in teaching their students a selected number of topics in computer science.

## Background

With the introduction of Lehrplan 21, Computer Science became an integral part of the Swiss education curriculum. Pupils learn to understand the basic concepts of Computer Science and how to use them for problem-solving. These concepts include methods on how to process, evaluate and summarize data, how to securely communicate and how to develop solution strategies for simple problems of information processing. The Education and Counselling Center for Computer Science Education at ETH Zürich supports schools to teach these concepts among others by providing teaching materials and learning environments.

## Goals

This thesis should implement chosen tasks and riddles from "einfach INFORMATIK 3/4" about:

* representing information with symbols,
* protecting data and keeping information secret and
* learning from data

at 3rd and 4th grade level.
Along with solving tasks and riddles about the mentioned topics the ability of reading, writing, counting and calculating is trained as well.

## Project setup

### Yarn

```
yarn install
```

#### Compiles and hot-reloads for development

```
yarn serve
```

#### Compiles and minifies for production

```
yarn build
```

#### Lints and fixes files

```
yarn lint
```

#### Run unit tests

```
yarn test:unit
```

#### Run e2e tests

When development server is already running

```
yarn test:e2e --url http://localhost:8080 --headless
```

else

```
yarn test:e2e --headless
```

#### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Run production build in docker container

#### Build

```bash
docker build . -t bsc-thesis -f deployment/Dockerfile
```

#### Run

```bash
docker run -p 8081:80 bsc-thesis
```

### Run production build with docker compose

```bash
docker-compose up
```

## Count words in the thesis report

```
texcount thesis.tex -inc -merge -total
```
