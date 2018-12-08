const express = require('express');
const path = require('path');
var _ = require('lodash');
var logger = require('./lib/utils/logger');
var chalk = require('chalk');
var http = require('http');
const app = express();
var server;

app.use(express.static(path.join(__dirname, '..', 'build')));

// Init http server
if( process.env.NODE_ENV !== 'production' ) {
	server = http.createServer(app);
}
else
	server = http.createServer();

// Init socket vars
var Primus = require('primus');
var api;

const clientIo = require('socket.io')(server);

// Init API Socket connection
api = new Primus(server, {
	transformer: 'websockets',
	pathname: '/api',
	parser: 'JSON'
});

api.plugin('emit', require('primus-emit'));
api.plugin('spark-latency', require('primus-spark-latency'));

// Init external API
let external = new Primus(server, {
	transformer: 'websockets',
	pathname: '/external',
	parser: 'JSON'
});

external.plugin('emit', require('primus-emit'));

// Init collections
var Collection = require('./lib/collection');
var Nodes = new Collection(external);

Nodes.setChartsCallback((err, charts) => {
	if(err !== null) {
		console.error('COL', 'CHR', 'Charts error:', err);
	}
	else {
		clientIo.emit('charts', charts);
	}
});

// Init API Socket events
api.on('connection', spark => {
	console.info('API', 'CON', 'Open:', spark.address.ip);
	spark.on('hello', data => {
		console.info('API', 'CON', 'Hello', data['id']);
		if( !_.isUndefined(data.id) && !_.isUndefined(data.info) ) {
			data.ip = spark.address.ip;
			data.spark = spark.id;
			data.latency = spark.latency || 0;

			Nodes.add( data, (err, info) => {
				if(err !== null) {
					console.error('API', 'CON', 'Connection error:', err);
					return false;
				}

				if(info !== null) {
					spark.emit('ready');
					console.success('API', 'CON', 'Connected', data.id);
					clientIo.emit('add', info);
				}
			});
		}
	});

	setInterval(() => {
		spark.emit('update-balance');
	}, 5000);

	spark.on('update', data => {
		if( !_.isUndefined(data.id) && !_.isUndefined(data.stats) ) {
			Nodes.update(data.id, data.stats, (err, stats) => {
				if(err !== null) {
					console.error('API', 'UPD', 'Update error:', err);
				}
				else {
					if(stats !== null) {
						clientIo.emit('update', stats);
						console.info('API', 'UPD', 'Update from:', data.id, 'for:', stats);
						Nodes.getCharts();
					}
				}
			});
		}
		else {
			console.error('API', 'UPD', 'Update error:', data);
		}
	});

	spark.on('balance', data => {
		console.success('Got Balance: ', data);
		clientIo.emit('balance', data);
	});

	spark.on('block', data => {
		// spark.emit('update-balance');
		if( !_.isUndefined(data.id) && !_.isUndefined(data.block) ) {
			Nodes.addBlock(data.id, data.block, (err, stats) => {
				if(err !== null) {
					console.error('API', 'BLK', 'Block error:', err);
				}
				else {
					if(stats !== null) {
						clientIo.emit('block', stats);
						console.success('API', 'BLK', 'Block:', data.block['number'], 'from:', data.id);
						Nodes.getCharts();
					}
				}
			});
		}
		else {
			console.error('API', 'BLK', 'Block error:', data);
		}
	});

	spark.on('pending', data => {
		if( !_.isUndefined(data.id) && !_.isUndefined(data.stats) ) {
			Nodes.updatePending(data.id, data.stats, (err, stats) => {
				if(err !== null) {
					console.error('API', 'TXS', 'Pending error:', err);
				}

				if(stats !== null) {
					clientIo.emit('pending', stats);
					console.success('API', 'TXS', 'Pending:', data.stats['pending'], 'from:', data.id);
				}
			});
		}
		else {
			console.error('API', 'TXS', 'Pending error:', data);
		}
	});

	spark.on('stats', data => {
		if( !_.isUndefined(data.id) && !_.isUndefined(data.stats) ) {
			Nodes.updateStats(data.id, data.stats, (err, stats) => {
				if(err !== null) {
					console.error('API', 'STA', 'Stats error:', err);
				}
				else {
					if(stats !== null) {
						clientIo.emit('stats', stats);
						console.success('API', 'STA', 'Stats from:', data.id);
					}
				}
			});
		}
		else {
			console.error('API', 'STA', 'Stats error:', data);
		}
	});

	spark.on('history', data => {
		console.success('API', 'HIS', 'Got history from:', data.id);
		var time = chalk.reset.cyan((new Date()).toJSON()) + " ";
		console.time(time, 'COL', 'CHR', 'Got charts in');
		Nodes.addHistory(data.id, data.history, (err, history) => {
			console.timeEnd(time, 'COL', 'CHR', 'Got charts in');
			if(err !== null) {
				console.error('COL', 'CHR', 'History error:', err);
			}
			else {
				clientIo.emit('charts', history);
			}
		});
	});

	spark.on('node-ping', data => {
		var start = (!_.isUndefined(data) && !_.isUndefined(data.clientTime) ? data.clientTime : null);
		spark.emit('node-pong', {
			clientTime: start,
			serverTime: _.now()
		});
		console.info('API', 'PIN', 'Ping from:', data['id']);
	});

	spark.on('latency', data => {
		if( !_.isUndefined(data.id) ) {
			Nodes.updateLatency(data.id, data.latency, (err, latency) => {
				if(err !== null) {
					console.error('API', 'PIN', 'Latency error:', err);
				}

				if(latency !== null) {
					// client.write({
					// 	action: 'latency',
					// 	data: latency
					// });
					console.info('API', 'PIN', 'Latency:', latency, 'from:', data.id);
				}
			});

			if( Nodes.requiresUpdate(data.id) ) {
				var range = Nodes.getHistory().getHistoryRequestRange();
				spark.emit('history', range);
				console.info('API', 'HIS', 'Asked:', data.id, 'for history:', range.min, '-', range.max);
				Nodes.askedForHistory(true);
			}
		}
	});

	spark.on('end', data => {
		Nodes.inactive(spark.id, (err, stats) => {
			if(err !== null) {
				console.error('API', 'CON', 'Connection end error:', err);
			}
			else {
				clientIo.emit('inactive', stats);
				console.warn('API', 'CON', 'Connection with:', spark.id, 'ended:', data);
			}
		});
	});
});

clientIo.on('connection', clientSpark => {
	clientSpark.on('ready', data => {
		clientIo.emit('init', { nodes: Nodes.all() });
		Nodes.getCharts();
	});

	clientSpark.on('client-pong', data => {
		var serverTime = _.get(data, "serverTime", 0);
		var latency = Math.ceil( (_.now() - serverTime) / 2 );
		clientIo.emit('client-latency', { latency: latency });
	});
});

var latencyTimeout = setInterval(() => {
	clientIo.emit('client-ping', {
		serverTime: _.now()
	});
}, 5000);

// Cleanup old inactive nodes
var nodeCleanupTimeout = setInterval(() => {
	clientIo.emit('init', Nodes.all());
	Nodes.getCharts();
}, 1000*60*60);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

server.listen(process.env.PORT || 3000);
