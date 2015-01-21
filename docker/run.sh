[ -z "$NODE_ENV" ] && export NODE_ENV=production
[ -z "$COUCH_HOST" ] && export COUCH_HOST=`/sbin/ip route|awk '/default/ { print $3 }'`
[ -z "$COUCH_PORT" ] && export COUCH_PORT=5984
[ -z "$COUCH_DB_NAME" ] && export COUCH_DB_NAME=caliper
[ -z "$HOST_PROTOCOL" ] && export HOST_PROTOCOL=http
[ -z "$HOST_DOMAIN" ] && export HOST_DOMAIN=localhost
[ -z "$HOST_PORT" ] && export HOST_PORT=9000

echo "starting app with: " \
     "    NODE_ENV:$NODE_ENV\n"\
     "    COUCH_HOST:$COUCH_HOST\n"\
     "    COUCH_PORT:$COUCH_PORT\n"\
     "    COUCH_DB_NAME:$COUCH_DB_NAME\n"\
     "    HOST_PROTOCOL:$HOST_PROTOCOL\n"\
     "    HOST_DOMAIN:$HOST_DOMAIN\n"\
     "    HOST_PORT:$HOST_PORT\n"

node /app/dist/server/app.js
