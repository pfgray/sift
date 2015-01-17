'use strict';

describe('Main', function () {
  var React = require('react/addons');
  var CaliperStoreApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    CaliperStoreApp = require('../../../src/scripts/components/CaliperStoreApp.js');
    component = React.createElement(CaliperStoreApp);
  });

  it('should create a new instance of CaliperStoreApp', function () {
    expect(component).toBeDefined();
  });
});
