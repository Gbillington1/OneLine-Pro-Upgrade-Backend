# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node:12.18.3-alpine

WORKDIR /home/node/src/oneline-backend

RUN mkdir chown -p /home/node/src/oneline-backend/node_modules && chown -R node:node /home/node/src/oneline-backend

COPY package*.json ./

RUN npm install

USER node

EXPOSE 4242

COPY --chown=node:node ./ .

CMD [ "node", "server.js" ]