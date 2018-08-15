const zmq = require('zeromq');
var responder = zmq.socket('rep');
const fs = require('fs');

responder.on('message', data => {
  let request = JSON.parse(data);
  console.log('Received request for ' + request.path);
  fs.readFile(request.path, (err, content) => {
    console.log('Sending response');
    responder.send(JSON.stringify({
      content: content.toString('utf8'),
      timestamp: Date.now(),
      pid: process.pid
    }));
  });
});

responder.bind('tcp://127.0.0.1:41234', err => {
  if (err) {
    throw err;
  }
  console.log('Listening for zmq request ...');
});

process.on('SIGINT', () => {
  console.log('Shutting down ...');
  responder.close();
});
