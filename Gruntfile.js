// browsers to test in saucelabs
var browsers = [{
  browserName: "firefox",
  version: "19",
  platform: "XP"
}, {
  browserName: "chrome",
  version: "20",
  platform: "XP"
}, {
  browserName: "internet explorer",
  platform: "XP",
  version: "6"
}, {
  browserName: "internet explorer",
  platform: "XP",
  version: "7"
}, {
  browserName: "internet explorer",
  platform: "XP",
  version: "8"
}, {
  browserName: "internet explorer",
  platform: "VISTA",
  version: "9"
}, {
  browserName: "internet explorer",
  platform: "VISTA",
  version: "10"
}, {
  browserName: "opera",
  platform: "XP",
  version: "12"
}/*, {
  browser: "android",
  os: "Linux",
  version: "4.0"
}, {
  browser: "iphone",
  os: "OS X 10.6",
  version: "4"
}*/];


module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    exec_jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },

    powerbuild: {
      options: {
        sourceMap: true
      },
      test: {
        files: [{
          src: 'test/**/*.js', dest: 'build/test-bundle.js'
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
          listenAddress: '127.0.0.1',
          listenPort: 9999,
          phantomjs: true,
          src: ['build/test-bundle.js']
        }
      }
    },

    'saucelabs-mocha': {
      all: {
        options: {
          urls: ["http://127.0.0.1:9999"],
          tunnelTimeout: 5,
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 3,
          browsers: browsers,
          testname: "tarruda/classic tests",
          tags: ["master"]
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
  grunt.loadNpmTasks('grunt-saucelabs');
  grunt.registerTask('test', ['newer:exec_jshint', 'powerbuild', 'mocha_debug']);

  grunt.registerTask('publish', ['mocha_debug', 'release']);
  grunt.registerTask('travis', ['test', 'saucelabs-mocha']);
  grunt.registerTask('default', ['test', 'watch']);
};
