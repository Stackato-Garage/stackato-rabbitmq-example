var express = require('express'),
    http = require('http'),
    path = require('path'),
    amqp = require('amqp'),
    redis = require('redis');

var client = redis.createClient();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

var connection = amqp.createConnection({ host: 'dev.rabbitmq.com' });

app.get('/', function(req, res){
  res.send('IT WORKS');
});

app.get('/start-server', function(req, res){
  //var connection = amqp.createConnection({ host: 'dev.rabbitmq.com' });

  /*connection.on('ready', function(){
    var e = connection.exchange('test-exchange');
    var q = connection.queue('test-queue');
    q.on('queueDeclareOk', function(args){
      q.bind(e, '#');
      q.on('queueBindOk', function(){
        q.on('basicConsumeOk', function(){
          var newMessage = 'new message';
          e.publish('routingKey', { wake_up: 'sheeple' });
        });
      });
      q.subscribe(function(msg){
        res.send(msg);
      });
    });
  });*/
});

app.get('/newexchange/:exchangeName', function(req, res){
  var exchangeName = req.params.exchangeName;
  var e = connection.exchange(exchangeName);
  res.send(e.name);
  exports.e = e;
});

app.get('/newqueue/:queueName', function(req, res){
  var queueName = req.params.queueName;
  var q = connection.queue(queueName);
  res.send(q.name);
  exports.q = q;
});

app.get('/get-info', function(req, res){
  res.send('Exchange name: ' + e.name + '. Queue name: ' + q.name);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});