FROM node:6.10.2

RUN mkdir /ap-npm

WORKDIR /ap-npm

VOLUME /ap-npm:/ap-npm

RUN npm install -g ap-npm

EXPOSE 4444

CMD [ "ap-npm", "serve", "-c=/ap-npm/config.json"]