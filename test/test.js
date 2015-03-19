var gulp = require('gulp')
var assert = require('assert')
var fs = require('fs')
var File = require('vinyl')
var rm = require('rimraf')

var cordova = require('../')

describe('gulp-cordovacli', function() {
  var CONFIG_FILE = '../fixtures.json'

  it('should emit an error if no commands and no file are provided', function(done) {
    gulp.src('.')
      .pipe(cordova())
      .on('error', function(err) {
        assert(err)
        done()
      })
  })

  beforeEach(function(done) {
    gulp.src('.')
      .pipe(cordova(['create', 'test/test', 'test.test.test', 'Test'], { silent: false }))
      .on('close', function() {
        gulp.src('.')
          .pipe(cordova(['platform', 'add', 'browser'], { cwd: __dirname + '/test' }))
          .on('close', function() {
            done()
          })
      })
  })

  afterEach(function(done) {
    // process.chdir('../../')
    rm('test/test', function() {
      done()
    })
  })

  describe('using a configuration file', function() {
    var CONFIG_FILE = '../fixtures.json'

    it('should run the commands from the configuration file', function(done) {
      gulp.src(CONFIG_FILE)
        .pipe(cordova(false, { silent: false }))
        .on('close', function() {
          assert.equal(true, fs.existsSync(__dirname + '/test/platforms/browser'))

          done()
        })
    })

    it('explicit commands should override configuration file', function(done) {
      gulp.src(CONFIG_FILE)
        .pipe(cordova(['build'], { silent: false }))
        .on('close', function() {
          assert.equal(false, fs.existsSync(__dirname + '/test/platforms/browser'))

          done()
        })
    })
  })

  describe('without a configuration file', function() {
    it('should run the given commands', function (done) {
      gulp.src('.')
        .pipe(cordova(['platforms', 'add', 'browser'], { silent: false }))
        .on('close', function() {
          assert.equal(true, fs.existsSync(__dirname + '/test/platforms/browser'))

          done()
        })
    });

    it('should run multiple commands', function (done) {
      gulp.src('.')
        .pipe(cordova([[
            "plugin",
            "add",
            "org.apache.cordova.device"
          ],[
            "platform",
            "add",
            "browser"
          ]], { silent: false }))
        .on('close', function() {
          assert.equal(true, fs.existsSync(__dirname + '/test/platforms/browser'))
          assert.equal(true, fs.existsSync(__dirname + '/test/plugins/org.apache.cordova.device'))

          done()
        })
    })
  })
})
