var zmq = require('zeromq');

var subscriber = zmq.socket('sub');

// Tham số truyền vào là prefix
// Nếu là rỗng thì sẽ subscirbe mọi thông điệp
// Nếu khác rỗng thì sẽ chỉ subscribe các thông điệp có prefix là
// xâu truyền vào

subscriber.subscribe('');

subscriber.on('message', data => {
  let message = JSON.parse(data);
  let date = new Date(message.timestamp);
  console.log('File ' + message.file + ' has changed at ' + date);
})

subscriber.connect('tcp://127.0.0.1:41234');