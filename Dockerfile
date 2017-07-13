FROM node:boron

RUN mkdir /src

WORKDIR /src

RUN mkdir app
RUN mkdir app/src

COPY src /src
COPY bin /src/bin
COPY package.json /src/app/
COPY config.json /src/app/

RUN npm install
RUN npm run build

EXPOSE 4444

CMD [ "node", "/src/app/bin/ap-npm", "serve", "--config=/ap-npm/config.json"]
