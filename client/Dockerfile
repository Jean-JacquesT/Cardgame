FROM node:12

WORKDIR /client

COPY package*.json ./
COPY node_modules ./

RUN npm install
# RUN npm install express --save

COPY . .

EXPOSE 5003
CMD  [ "node", "main.js" ]
