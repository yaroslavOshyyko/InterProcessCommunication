var api = {};
global.api = api;
api.net = require('net');
api.cluster = require('cluster');
api.os = require('os');

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
var results = [];
var cpuCount = api.os.cpus().length;
var clientWorkers = [];
var index = {};

var server = api.net.createServer(function(socket) {


  clientWorkers.push(socket);
  index[socket] = clientWorkers.length;
  var startPoint = (task.length / cpuCount) * (clientWorkers.length - 1);
  var endPoint = startPoint + (task.length / cpuCount);
  console.log(startPoint + " " + endPoint);
  var dataToProcess = JSON.stringify(task.slice(startPoint, endPoint));
  socket.write(dataToProcess);

  socket.on('data', function(data){
    console.log('Data received (by server)'  + data);
    results[index[socket]] = JSON.parse(data);
    console.log("Result: " + results);
  });

}).listen(8080);

