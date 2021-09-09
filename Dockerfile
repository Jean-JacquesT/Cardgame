FROM node:12

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install
RUN npm install sqlite3
RUN npm install --save-dev window

COPY . .

EXPOSE 8082
CMD [ "node", "server/main.js" ]