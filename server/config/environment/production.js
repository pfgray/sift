'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  /*
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,
            */

  // Server port
  port:     //process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            9000,


  // CouchDB connection options
  couch: {
    host: process.env.COUCH_HOST,
    port: process.env.COUCH_PORT,
    db_name: process.env.COUCH_DB_NAME
  }

};