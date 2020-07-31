# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node:12.18.3-alpine

RUN mkdir chown -p /home/node/oneline-backend/node_modules && chown -R node:node /home/node/oneline-backend

WORKDIR /home/node/src/oneline-backend

COPY package*.json ./


RUN npm install
USER node

COPY --chown=node:node ./src .

CMD [ "node", "server.js" ]