FROM node:8

RUN apt-get update

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package.json package-lock.json /home/app/
RUN npm install
COPY index.js /home/app/
COPY utils.js /home/app/
COPY config.json /home/app/
COPY spamassassin-rules.json /home/app/
COPY controllers/ /home/app/
COPY routers/ /home/app/

CMD npm run dev