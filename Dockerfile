FROM mhart/alpine-node:10
WORKDIR /usr/src

COPY package.json ./
RUN npm

COPY . .
RUN npm build && mv build /public