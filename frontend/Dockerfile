FROM node:8.4.0-alpine
MAINTAINER Frederic labelle <frederic@e-founders.com>
LABEL name="invoicex-frontend"

RUN mkdir -p /opt/app
WORKDIR /opt/app

# Install packages using yarn
COPY package.json yarn.lock /opt/app/
RUN yarn

COPY . /opt/app

EXPOSE 3000

CMD ["yarn", "start"]
