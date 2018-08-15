const zmq = require('zeromq');
const cluster = require('cluster');
const fs = require('fs');

// Trong cluster chia thành 2 tiến trình: master, worker
// master là tiến trình gốc
// worker là các tiến trình con sinh ra từ tiến trình gốc

if (cluster.isMaster) {
  // master code

  let router = zmq.socket('router').bindSync('tcp://127.0.0.1:41234');
  let dealer = zmq.socket('dealer').bind('tcp://127.0.0.1:8000');

  router.on('message', () => {
    // Mảng mặc định được truyền cho router, dealer
    // Khi có thông điệp truyền tới, router sẽ chuyển cho dealer
    let frames = [].slice.call(arguments);
    dealer.send(frames); // send frames to worker (send copy version)
  });

  dealer.on('message', () => {
    // Khi có thông điệp gửi từ worker, truyền sang cho router
    let frames = [].slice.call(arguments);
    router.send(frames);
  });

  // Bắt sự kiện worker được tạo ra
  cluster.on('online', worker => {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  for (let i = 0; i < 3; i++) {
    cluster.fork(); // Tạo worker mới
  }
}
else {
  // worker code

  // connect via proxy
  let responder = zmq.socket('rep').connect('tcp://127.0.0.1:8000');
  responder.on('message', data => {
    let request = JSON.parse(data);
    console.log(process.pid + ' receive request for ' + request.path);
    fs.readFile(request.path, (err, content) => {
      console.log(process.pid + ' sending response ...');
      responder.send(JSON.stringify({
        content: content.toString(),
        timestamp: Date.now(),
        pid: process.pid
      }));
    })
  })
}
