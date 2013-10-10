
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    exec_jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },

    powerbuild: {
      options: {
        sourceMap: true,
        compress: true
      },
      test: {
        files: [{
          src: [
            'node_modules/grunt-mocha-debug/node_modulesrun-mocha/index.js',
            'test/**/*.js'
          ],
          dest: 'scripts/test-bundle.js'
        }]
      }
    },

    mocha_debug: {
      options: {
        reporter: 'dot',
        check: ['src/**/*.js', 'test/**/*.js']
      },
      nodejs: {
        options: {
          src: ['src/**/*.js', 'test/**/*.js']
        }
      },
      browser: {
        options: {
          phantomjs: true,
          src: ['scripts/test-bundle.js']
        }
      }
    },

    watch: {
      options: {
        nospawn: true
      },
      all: {
        files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        tasks: ['test']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec-jshint');
  grunt.loadNpmTasks('grunt-mocha-debug');
  grunt.loadNpmTasks('powerbuild');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-release');
  grunt.registerTask('test', ['newer:exec_jshint', 'powerbuild', 'mocha_debug']);

  grunt.registerTask('publish', ['mocha_debug', 'release']);
  grunt.registerTask('travis', ['exec_jshint', 'mocha_debug']);
  grunt.registerTask('default', ['test', 'watch']);
};
