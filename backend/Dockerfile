FROM node:8.4.0-alpine
MAINTAINER Frederic Labelle <frederic@e-founders.com>
LABEL name="invoicex-backend"

RUN mkdir -p /opt/app
WORKDIR /opt/app

RUN apk add --no-cache git

# Install packages using yarn
COPY package.json yarn.lock /opt/app/
RUN yarn

COPY . /opt/app

EXPOSE 8080

CMD ["yarn", "start"]
