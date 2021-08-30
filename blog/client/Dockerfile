FROM node:alpine

ENV CI=true

WORKDIR /app
COPY package.json ./
RUN npm i
COPY ./ ./

CMD ["npm", "start"]