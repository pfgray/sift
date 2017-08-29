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
        const def = Q.defer();
        serviceEmitter.on(eventName, (err, service) => {
          err ? def.reject(err) : def.resolve(service);
        });
        return def.promise;
      } else {
        console.log('######Now initted,',eventName);
        state.initting = true;
        return config.init()
          .then(config.get)
          .then(service => {
            state.initted = true;
            state.initting = false;
            serviceEmitter.emit(eventName, null, service);
            return service;
          })
          .catch(err => {
            console.log('Failed to start service: ', err);
            state.initting = false;
            serviceEmitter.emit(eventName, err);
            throw err;
          });
      }
    }
  };
}
