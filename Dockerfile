FROM node:boron

RUN mkdir /ap-npm

WORKDIR /ap-npm/app

RUN mkdir app
RUN mkdir app/src

COPY src /ap-npm/app/src
COPY bin /ap-npm/app/bin
COPY package.json /ap-npm/app/
COPY config.json /ap-npm/app/

RUN npm install
RUN npm run build

EXPOSE 4444

CMD [ "node", "/ap-npm/app/bin/ap-npm", "serve", "--config=/ap-npm/config.json"]
