FROM dockerfile/nodejs

ADD ./ /app
WORKDIR /app
RUN npm install
RUN npm install grunt-cli -g
RUN grunt build

EXPOSE 9000

CMD ["/bin/bash", "/app/docker/run.sh"]
