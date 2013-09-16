# syslog-stream

Create a writable stream for syslog using C bindings.

## Installation

Install using [npm](https://npmjs.org/):

```sh
npm install syslog-stream
```

## Example

```javascript
var syslog = require('syslog-stream');

// Use stream methods
syslog.severity = 'debug';
fs.createReadStream(filename).pipe(syslog);
syslog.write('Message to syslog', 'utf8', function() {
  // written to syslog
});

// Use syslog methods
syslog.info('find me in the logs');
syslog.warn('Streams are too cool');
syslog.error('Red alert');
```

## Test

Tests are written with [mocha](https://github.com/visionmedia/mocha/) and
[should](https://github.com/visionmedia/should.js) using BDD-style assertions.

Run them with npm:

```sh
npm test
```

## MIT Licensed
