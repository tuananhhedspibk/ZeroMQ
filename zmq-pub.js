var zmq = require('zeromq');
var publisher = zmq.socket('pub');
var fs = require('fs');
var filename = process.argv[2];

fs.watch(filename, () => {
  publisher.send(JSON.stringify({
    type: 'changed',
    file: filename,
    timestamp: Date.now()
  }));
});

publisher.bind('tcp://127.0.0.1:41234', err => {
  if (err) {
    throw err;
  }
  console.log('Listening for zmq subscribers');
});
