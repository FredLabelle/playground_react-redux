FROM node:8.2.1-alpine
MAINTAINER Simon Arvaux <simon@e-founders.com>
LABEL name="investorx-frontend"

RUN mkdir -p /opt/app
WORKDIR /opt/app

# Install packages using yarn
COPY package.json yarn.lock /opt/app/
RUN yarn

COPY . /opt/app

EXPOSE 3000

CMD ["yarn", "start"]
