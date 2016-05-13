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
var numberOfTasks = [];

var server = api.net.createServer(function(socket) {

  restart();

  clientWorkers.push(socket);
  index[socket] = clientWorkers.length;
  numberOfTasks.push(task[0]);
  recalculateTasks();
  var startPoint = 0;
  var endPoint = numberOfTasks[0];
  var counter = 0;
  for(var i = 0; i < clientWorkers.length; i++){
    var dataToProcess = JSON.stringify(task.slice(startPoint, endPoint));
    startPoint = endPoint;
    endPoint = endPoint + numberOfTasks[++counter];
    clientWorkers[i].write(dataToProcess);
  }



  socket.on('data', function(data){
    console.log('Data received (by server)'  + data);
    results[index[socket]] = JSON.parse(data);
    console.log("Result: " + results);
  });

}).listen(8080);

function restart(){

  results = [];
}

function recalculateTasks(){
  var tasks = Math.floor(task.length / clientWorkers.length);
  console.log(tasks);
  var uncomplettedTasks = task.length;
  for(var i = 0; i < numberOfTasks.length; i++){
      uncomplettedTasks = uncomplettedTasks - tasks;
      numberOfTasks[i] = tasks;
  }
  if(uncomplettedTasks > 0){
    numberOfTasks[numberOfTasks.length-1] = numberOfTasks[numberOfTasks.length-1] + uncomplettedTasks;
  }
}
