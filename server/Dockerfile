FROM node:18

WORKDIR /server

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "node", "server.js" ]