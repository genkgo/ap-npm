FROM node:6.10.2

RUN mkdir -p /usr/src/ap-npm
WORKDIR /usr/src/ap-npm

COPY package.json /usr/src/ap-npm
RUN npm install

COPY . /usr/src/ap-npm

EXPOSE 4444

CMD [ "npm", "start", "--port=4444"]