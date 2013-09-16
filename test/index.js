/**
 * syslog-stream tests
 */

var should = require('should');

describe('module', function() {
  it('should export Syslog', function(done) {
    var Syslog = require('..');
    should.exist(Syslog);
    Syslog.should.be.a('function');
    Syslog.should.have.property('name', 'Syslog');
    done();
  });
});

describe('Syslog', function() {
  it('should inherit from stream.Writable', function(done) {
    var logger = new (require('..'));
    logger.should.have.property('_write');
    logger._write.should.be.a('function');
    logger.should.have.property('write');
    logger.write.should.be.a('function');
    done();
  });

  it('should write to syslog', function(done) {
    var logger = new (require('..'));
    logger.log('debug', 'testing Syslog.write');
    done();
  });

  it('should emit log event', function(done) {
    var logger = new (require('..'));
    logger.on('log', function(message) {
      should.exist(message);
      message.should.equal('testing log event');
      done();
    });
    logger.log('debug', 'testing log event');
  });

  it('should write to syslog using Stream.write', function(done) {
    var logger = new (require('..'));
    logger.write('testing Stream.write', 'utf8', function() {
      done();
    });
  });
});
