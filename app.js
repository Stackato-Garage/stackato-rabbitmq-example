var connection = require('amqp').createConnection({ host: 'localhost', port: 5672 });
var count = 0;

connection.on('ready', function(){
	console.log('Connected to ' + connection.serverProperties.product);
	var e = connection.exchange('test-exchange');
	var q = connection.queue('test-queue');
	q.on('queueDeclareOk', function(args){
		console.log('Queue opened');
		q.bind(e, '#');
		q.on('queueDeclareOk', function(args){
			console.log('Queue bound');
			setInterval(function(){
				console.log('Publishing message #' + ++count);
				e.publish('routingKey', {count: count});
			}, 1000);
		});
	});
});