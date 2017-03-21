/* jshint esversion: 6 */



var _       = require('lodash');
var exec    = require('child_process').exec;
var through = require('through2');
var expect  = require('expect.js');
var path    = require('path');
var fs      = require('fs-extra');

module.exports = {


  getCliPath: function (cwd) {
    return path.resolve(cwd, path.resolve(process.cwd(), 'bin', 'schemalib'));
  },

  getCliCommand: function (cwd, flags) {
    return this.getCliPath(cwd) + ' ' + flags;
  },

  getSupportDirectoryPath: function () {
    return path.resolve(__dirname);
  },

  resolveSupportPath: function () {
    var args = [].slice.apply(arguments);

    args = [this.getSupportDirectoryPath()].concat(args);
  
    return path.resolve.apply(path, args);
  },


  clearDirectory: function () {
    return through.obj(function (file, encoding, callback) {
      exec('rm -rf ./* ', { cwd: file.path }, function (err) {
        callback(err, file);
      });
    });
  },

  removeFile: function (filePath) {
    return through.obj(function (file, encoding, callback) {
      exec('rm ' + filePath, { cwd: file.path }, function (err) {
        callback(err, file);
      });
    });
  },

  runCli: function (args, options) {
    options = options || {};

    var that = this;


    return through.obj(function (file, encoding, callback) {

      var command = that.getCliCommand(file.path, args);
      var env     = _.extend({}, process.env, options.env);

      logToFile(command);

      exec(command, { cwd: file.path, env: env }, function (err, stdout, stderr) {
        var result = file;

        logToFile({err: err, stdout: stdout, stderr: stderr});

        if (stdout) {
          expect(stdout).to.not.contain('EventEmitter');
        }

        if (options.pipeStdout) {
          result = stdout;
        } else if (options.pipeStderr) {
          result = stderr;
        }

        if (options.exitCode) {
          try {
            expect(err).to.be.ok();
            expect(err.code).to.equal(1);
            callback(null, result);
          } catch (e) {
            callback(e, result);
          }
        } else {
          err = options.pipeStderr ? null : err;
          callback(err, result);
        }
      });
    });
  },

  copyFile: function (from, to) {
    return through.obj(function (file, encoding, callback) {
      fs.copy(from, path.resolve(file.path, to), function (err) {
        callback(err, file);
      });
    });
  },

  listFiles: function (subPath) {
    return through.obj(function (file, encoding, callback) {
      var cwd = path.resolve(file.path, subPath || '');

      exec('ls -ila', { cwd: cwd }, callback);
    });
  },

  expect: function (fun) {
    return through.obj(function (stdout, encoding, callback) {
      try {
        fun(stdout);
        callback(null, stdout);
      } catch (e) {
        console.log(e);
        callback(e, null);
      }
    });
  },

  ensureContent: function (needle) {
    return this.expect(function (stdout) {
      if (needle instanceof RegExp) {
        expect(stdout).to.match(needle);
      } else {
        expect(stdout).to.contain(needle);
      }
    });
  },

  overwriteFile: function (content, pathToFile) {
    return through.obj(function (file, encoding, callback) {
      var filePath = path.join(file.path, pathToFile);

      fs.writeFile(filePath, content, function (err) {
        callback(err, file);
      });
    });
  },

  readFile: function (pathToFile) {
    return through.obj(function (file, encoding, callback) {
      exec('cat ' + pathToFile, { cwd: file.path }, callback);
    });
  },


  teardown: function (done) {
    return through.obj(function (smth, encoding, callback) {
      callback();
      done(null, smth);
    });
  },

};

function logToFile (thing) {
  var text = (typeof thing === 'string') ? thing : JSON.stringify(thing);
  var logPath = __dirname + '/../../logs';
  var logFile = logPath + '/test.log';

  fs.mkdirpSync(logPath);
  fs.appendFileSync(logFile, '[' + new Date() + '] ' + text + '\n');
}