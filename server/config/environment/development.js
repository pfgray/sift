// Development specific configuration
// ==================================
module.exports = {
  // CouchDB connection options
  couch: {
    host: process.env.COUCH_HOST || 'http://localhost',
    port: process.env.COUCH_PORT || 5984,
    db_name: process.env.COUCH_DB_NAME || 'caliper'
  },
  admin: {
    username: process.env.ADMIN_USER || 'admin',
    pw: process.env.ADMIN_PW || 'password',
  }
};
