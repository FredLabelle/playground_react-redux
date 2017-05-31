FROM node:7.10.0-alpine
MAINTAINER Simon Arvaux <simon@e-founders.com>
LABEL name="investorx-frontend"

WORKDIR /opt/app

# Install packages using yarn
COPY package.json yarn.lock /tmp/
RUN cd /tmp && yarn
RUN mkdir -p /opt/app && cd /opt/app && ln -s /tmp/node_modules

COPY . /opt/app

EXPOSE 3000

CMD ["yarn", "start"]
