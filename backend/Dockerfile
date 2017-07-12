FROM node:8.1.4-alpine
MAINTAINER Simon Arvaux <simon@e-founders.com>
LABEL name="investorx-backend"

RUN mkdir -p /opt/app
WORKDIR /opt/app

RUN apk add --no-cache git

# Install packages using yarn
COPY package.json yarn.lock /opt/app/
RUN yarn

COPY . /opt/app

EXPOSE 8080

CMD ["yarn", "start"]
