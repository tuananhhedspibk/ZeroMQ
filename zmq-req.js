const zmq = require('zeromq');
var requester = zmq.socket('req');
const filename = process.argv[2];

requester.on('message', data => {
  let response = JSON.parse(data);
  console.log('Receive response: ' + response.content + ' at ' + Date(response.timestamp));
});

requester.connect('tcp://127.0.0.1:41234');

for (let i = 0; i < 5; i++) {
  console.log('Sending request ' + i + ' for ' + filename);
  requester.send(JSON.stringify({
    path: filename
  }));
}
