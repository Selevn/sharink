FROM node:22.7.0-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY lib lib
COPY main main

RUN npm run install-all
RUN npm run build-all

EXPOSE 8080

CMD ["node", "/usr/src/app/main/dist"]
