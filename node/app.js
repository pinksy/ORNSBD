var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io')
  , amqp = require('amqp');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/basic', routes.basic);
app.get('/pretty', routes.pretty);

var server = http.createServer(app);
var io = socketio.listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var connection = amqp.createConnection({host: 'localhost'});

connection.on('ready', function(){
  console.log('Connected to RabbitMQ');

  io.sockets.on('connection', function (socket) {
    console.log('Socket connected: ' + socket.id);

    connection.exchange('oraclemq', {type: 'direct', autoDelete: false}, function(exchange){

      connection.queue('tmp-' + Math.random(), {exclusive: true}, function(queue){

        queue.bind('oraclemq', 'MANGO');
        queue.bind('oraclemq', 'GRAPE');
        queue.bind('oraclemq', 'CHERRY');
        queue.bind('oraclemq', 'KIWI');
        queue.bind('oraclemq', 'POTATO');
        queue.bind('oraclemq', 'LETTUCE');
        queue.bind('oraclemq', 'PEPPER');
        queue.bind('oraclemq', 'PUMPKIN');
        console.log(' [*] Waiting for logs. To exit press CTRL+C')

        queue.subscribe(function(msg){
          socket.emit('data', msg.data.toString('utf-8')); // or we could build the JSON here
        });
      });
    });
  });
});