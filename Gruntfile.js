/*!
 * Copyright(C) 2013 Kazumasa Kohtaka <kkohtaka@gmail.com>
 */
/*jslint node: true */

(function () {

  'use strict';

  var path, lrSnippet, folderMount, middleware;

  path = require('path');
  lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

  folderMount = function (connect, point) {
    return connect['static'](path.resolve(point));
  };

  middleware = function (connect, options) {
    return [lrSnippet, folderMount(connect, options.base)];
  };

  module.exports = function (grunt) {

    grunt.initConfig({
      connect: {
        sample: {
          options: {
            port: 8888,
            base: 'sample',
            middleware: middleware
          }
        }
      },
      regarde: {
        src: {
          files: [ 'src/**/*.js' ],
          tasks: [ 'jslint', 'build', 'livereload' ]
        },
        sample: {
          files: [ 'sample/**/*.js' ],
          tasks: [ 'jslint' ]
        },
        gruntfile: {
          files: [ 'Gruntfile.js' ],
          tasks: [ 'jslint' ]
        }
      },
      jslint: {
        files: [
          'src/**/*.js',
          'sample/**/*.js',
          'Gruntfile.js'
        ],
        exclude: [ 'sample/js/liaison.js', '**/vendor/*.js' ],
        directives: {
          indent: 2,
          browser: true,
          predef: [
            'Liaison'
          ]
        },
        options: {
          failOnError: false
        }
      },
      uglify: {
        dist: {
          files: {
            'dist/liaison.js': [ 'src/**/*.js' ]
          }
        },
        options: {
          preserveComments: 'some'
        }
      },
      copy: {
        dist: {
          files: [
            {
              expand: true,
              cwd: 'dist/',
              src: '**/*.js',
              dest: 'sample/js/'
            }
          ]
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-regarde');

    grunt.registerTask('build', [ 'uglify', 'copy' ]);

    grunt.registerTask('default', [
      'livereload-start',
      'jslint',
      'build',
      'connect',
      'regarde'
    ]);
  };
}());

