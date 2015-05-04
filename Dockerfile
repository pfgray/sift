FROM dockerfile/ubuntu

RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install -y nodejs

ADD ./ /app
WORKDIR /app
RUN npm install
RUN npm install grunt-cli -g
RUN grunt build

EXPOSE 9000

CMD ["/bin/bash", "/app/docker/run.sh"]
