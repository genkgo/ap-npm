FROM node:6.10.2

RUN mkdir -p /srv/ap-npm
RUN mkdir -p /ap-npm/storage
RUN mkdir -p /ap-npm/ssl

WORKDIR /srv/ap-npm

VOLUME /ap-npm:/ap-npm

COPY package.json /srv/ap-npm
RUN npm install

COPY . /srv/ap-npm

EXPOSE 4444

CMD [ "npm", "start", "--", "serve"]