/*jshint esversion: 6 */

var chai        = require('chai');
var pkg         = (require(__dirname + '/../package.json'));
var schemalib   = './bin/schemalib';
var gulp        = require('gulp');
var helpers     = require(__dirname + '/support/helpers');
require('shelljs/global');

/**
 * Define Chai assertation shorthands.
 */
var expect = chai.expect;
var should = chai.should;

describe('workspace', function () {
  describe('init', function () {
      it('should return DONE', function (done) {
        var cmd = ' workspace init -f ';

        gulp
            .src(helpers.resolveSupportPath('tmp'))
            .pipe(helpers.clearDirectory())
            .pipe(helpers.runCli(cmd,{pipeStdout: true}))
            .pipe(helpers.expect(function (output) {
                expect(output).to.be.a('string');
                expect(output).to.have.length.above(0);
                expect(output).to.contain('DONE');
            }))
            .pipe(helpers.teardown(done));

      });
  });
});
