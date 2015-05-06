FROM fedora

RUN yum -y update && yum clean all
RUN yum -y install npm && yum clean all

ADD ./ /app
WORKDIR /app
RUN npm install grunt-cli -g
RUN npm install
RUN grunt build

EXPOSE 9000

CMD ["/bin/bash", "/app/docker/run.sh"]
