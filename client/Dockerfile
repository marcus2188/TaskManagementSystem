FROM node:latest
WORKDIR /src/index
COPY package.json ./
COPY package-lock.json ./
COPY . .
RUN npm install
CMD ["npm", "run", "start"]