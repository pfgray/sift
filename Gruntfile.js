'use strict';

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var webpackDistConfig = require('./webpack.dist.config.js'),
    webpackDevConfig = require('./webpack.dev.config.js');

module.exports = function (grunt) {
  // Let *load-grunt-tasks* require everything
  require('load-grunt-tasks')(grunt);

  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch(e) {
    localConfig = {};
  }

  // Read configuration from package.json
  var pkgConfig = {
    client:{
      dist: 'dist/client',
      src: 'client'
    },
    server:{
      dist: 'dist/server',
      src: 'server'
    },
    dist_root:'dist'
  }

  grunt.initConfig({
    pkg: pkgConfig,

    webpack: {
      dist:webpackDistConfig,
      dev: webpackDevConfig
    },

    open: {
      options: {
        delay: 500
      },
      dev: {
        path: 'http://localhost:<%= connect.options.port %>/'
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    copy: {
      dist: {
        files: [
          // includes files within path
          {
            flatten: true,
            expand: true,
            src: ['<%= pkg.client.src %>/*'],
            dest: '<%= pkg.client.dist %>/',
            filter: 'isFile'
          },{
            flatten: true,
            expand: true,
            src: ['<%= pkg.client.src %>/images/*'],
            dest: '<%= pkg.client.dist %>/images/'
          },{
            flatten:false,
            expand: true,
            src: ['<%= pkg.server.src %>/**/*'],
            dest: __dirname + '/<%= pkg.dist_root %>/',
            filter: 'isFile'
          }
        ]
      },
      dev: {
        files: [{
          flatten: true,
          expand: true,
          src: ['<%= pkg.client.src %>/*'],
          dest: './.tmp/',
          filter: 'isFile'
        },{
          flatten: true,
          expand: true,
          src: ['<%= pkg.client.src %>/images/*'],
          dest: './.tmp/images/'
        }]
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= pkg.client.dist %>'
          ]
        }]
      },
      server: '.tmp'
    },

    nodemon: {
      dev: {
        script: 'server/app.js',
        options:{
          ignore: ['client/', '.tmp/']
        }
      }
    }

  });

  grunt.registerTask('serve', ['clean:server', 'copy:dev', 'webpack:dev', 'nodemon:dev']);

  grunt.registerTask('test', ['karma']);

  grunt.registerTask('build', ['clean', 'copy', 'webpack:dist']);

  grunt.registerTask('default', []);
};
