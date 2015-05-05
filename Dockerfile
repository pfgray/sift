FROM centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm

ADD ./ /app
WORKDIR /app
RUN npm install
RUN npm install grunt-cli -g
RUN grunt build

EXPOSE 9000

CMD ["/bin/bash", "/app/docker/run.sh"]
