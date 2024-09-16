FROM node:22.7.0-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY lib lib
COPY youtube-microservice youtube-microservice

RUN npm run install-all
RUN npm run build-all

CMD ["node", "/usr/src/app/youtube-microservice/dist/server.cjs"]