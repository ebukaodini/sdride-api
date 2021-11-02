FROM node:17-alpine3.12

WORKDIR /app

COPY app/package.json /app

RUN npm install

COPY ./app /app

EXPOSE 3000

CMD npm start