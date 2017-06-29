FROM node:6.10.2

RUN mkdir /ap-npm

WORKDIR /ap-npm

RUN npm install -g ap-npm@git+https://git@github.com/genkgo/ap-npm.git

EXPOSE 4444

CMD [ "ap-npm", "serve", "--config=/ap-npm/config.json"]
