/**
 * @module Syslog
 * @summary Create a writable stream to syslog using c bindings.
 * @link https://github.com/bloodhound/syslog-stream
 */

var stream = require('stream');
var syslog = require('./build/Release/syslog');

var connected = false;

/**
 * Export `Syslog`
 */

module.exports = Syslog;

/**
 * Close connection to syslog on exit
 */

process.on('exit', function() {
  if (connected) syslog.close();
});

/**
 * Initialize a new Syslog stream with given `identity` and `facility`.
 *
 * @param {String} identity Defaults to "node".
 * @param {String} facility Defaults to "local0".
 * @return {Syslog}
 * @api public
 */

function Syslog(identity, facility) {
  this.identity = identity || 'node';
  this.facility = facility || 'user';
  this.severity = 'debug';
  // Open connection to syslog
  connected = syslog.open(this.identity, this.facilities[this.facility] * 8);
  // Call parent constructor
  stream.Writable.call(this, { decodeStrings: false });
};

/**
 * Inherit from stream.Writable
 */

Syslog.prototype = Object.create(stream.Writable.prototype, {
  constructor: { value: Syslog }
});

/**
 * Write to syslog
 */

Syslog.prototype._write = function(chunk, encoding, callback) {
  if (!encoding) chunk = chunk.toString(encoding);
  this.log(this.severity, chunk);
  return callback();
};

/**
 * Log given `message` to syslog.
 *
 * @param {String} severity
 * @param {String} message
 * @api public
 */

Syslog.prototype.log = function(severity, message) {
  syslog.write(this.severities[severity], message);
  this.emit('log', message, this.severities[severity]);
};

/**
 * Facilities
 */

Syslog.prototype.facilities = {
  'kernel':   0,
  'user':     1,
  'mail':     2,
  'daemon':   3,
  'auth':     4,
  'syslog':   5,
  'lpr':      6,
  'news':     7,
  'uucp':     8,
  'local0':   16,
  'local1':   17,
  'local2':   18,
  'local3':   19,
  'local4':   20,
  'local5':   21,
  'local6':   22,
  'local7':   23
};

/**
 * Priorities / Severities
 */

Syslog.prototype.severities = {
  'emergency': 0,
  'emerg':     0,
  'alert':     1,
  'critical':  2,
  'crit':      2,
  'error':     3,
  'err':       3,
  'warning':   4,
  'warn':      4,
  'notice':    5,
  'info':      6,
  'debug':     7,
  'trace':     7
};

/**
 * Log message with severity of method name.
 */

Object.keys(Syslog.prototype.severities).forEach(function(severity) {
  Syslog.prototype[severity] = function(message) {
    this.log(severity, message);
  };
});
