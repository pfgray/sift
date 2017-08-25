var EventEmitter = require('events');
var Q = require('q');

var serviceEmitter = new EventEmitter();

module.exports = function(config){
  const eventName = config.prefix + '_INITTED';
  const state = {
    initted: false,
    initting: false
  };
  return {
    get: function get() {
      if(state.initted){
        return config.get();
      } else if(state.initting){
        const deferred = Q.defer();
        serviceEmitter.on(eventName, (err, service) => {
          err ? def.reject(err) : def.resolve(service);
        });
        return deferred;
      } else {
        state.initting = true;
        return config.init()
          .then(config.get)
          .then(service => {
            state.initted = true;
            serviceEmitter.emit(eventName, null, service);
            return service;
          })
          .catch(err => {
            serviceEmitter.emit(eventName, err);
            throw err;
          });
      }
    }
  };
}
