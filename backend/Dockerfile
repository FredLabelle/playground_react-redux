FROM node:8.0.0-alpine
MAINTAINER Simon Arvaux <simon@e-founders.com>
LABEL name="investorx-backend"

RUN mkdir -p /opt/app
WORKDIR /opt/app

# Install node-gyp dependencies
RUN apk add --no-cache make gcc g++ python
# Install node-gyp
RUN yarn global add node-gyp

# Install packages using yarn
COPY package.json yarn.lock /opt/
RUN cd /opt && yarn
ENV NODE_PATH=/opt/node_modules

COPY . /opt/app

EXPOSE 8080

CMD ["yarn", "start"]
