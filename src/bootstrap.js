import { createStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import reducers from './reducers';
import io from 'socket.io-client';
import _ from 'lodash';

/**
 * Sockets
 */
const socket = io();
// console.log(socket);

/**
 * Store
 */
const store = createStore(reducers, applyMiddleware(thunk));

let MAX_BINS = 40;
let $scope = {};
// Main Stats init
// ---------------

$scope.frontierHash = '0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa';
$scope.nodesTotal = 0;
$scope.nodesActive = 0;
$scope.bestBlock = 0;
$scope.lastBlock = 0;
$scope.lastDifficulty = 0;
$scope.upTimeTotal = 0;
$scope.avgBlockTime = 0;
$scope.blockPropagationAvg = 0;
$scope.avgHashrate = 0;
$scope.uncleCount = 0;
$scope.bestStats = {};

$scope.lastGasLimit = _.fill(Array(MAX_BINS), 2);
$scope.lastBlocksTime = _.fill(Array(MAX_BINS), 2);
$scope.difficultyChart = _.fill(Array(MAX_BINS), 2);
$scope.transactionDensity = _.fill(Array(MAX_BINS), 2);
$scope.gasSpending = _.fill(Array(MAX_BINS), 2);
$scope.miners = [];


$scope.nodes = [];
$scope.map = [];
$scope.blockPropagationChart = [];
$scope.uncleCountChart = _.fill(Array(MAX_BINS), 2);
$scope.coinbases = [];

$scope.latency = 0;

$scope.currentApiVersion = "0.1.1";

$scope.prefixPredicate = ['-pinned', '-stats.active'];
$scope.originalPredicate = ['-stats.block.number', 'stats.block.propagation'];

$scope.getNumber = num => new Array(num);

// Socket listeners
// ----------------
socket.emit('ready');
console.log('The connection has been opened.');
socket.on('data', data => {
  // console.log(data);
  socketAction(data.action, data.data);
})
socket.on('block', data => {
  // console.log(data);
  socketAction('block', data);
})
socket.on('stats', data => {
  // console.log(data);
  socketAction('stats', data);
})
socket.on('balance', data => {
  // console.log(data);
  socketAction("balance", data);
});
socket.on('init', data => {
  // console.log(data);
  socketAction("init", data.nodes);
});
socket.on('client-latency', data => {
  // console.log(data);
  $scope.latency = data.latency;
  store.dispatch({
    type: 'NETWORK_UPDATE',
    data: {
      pageLatency: $scope.latency
    }
  });
})

const socketAction = (action, data) => {
	// filter data
	data = xssFilter(data);

	// console.log('Action: ', action);
	// console.log('Data: ', data);
  let index = -1;
	switch(action)
	{
		case "init":
			$scope.nodes = data;

			_.forEach($scope.nodes, (node, index) => {

				// Init hashrate
				if( _.isUndefined(node.stats.hashrate) )
					node.stats.hashrate = 0;

				// Init latency
				latencyFilter(node);

				// Init history
				if( _.isUndefined(data.history) )
				{
					data.history = new Array(40);
					_.fill(data.history, -1);
				}

				// Init or recover pin
				node.pinned = false;
			});

			if( $scope.nodes.length > 0 )
			{
        store.dispatch({
          type: 'NODES_UPDATE',
          nodes: $scope.nodes
        });
        store.dispatch({
          type: 'TOPOLOGY_UPDATE',
          nodes: $scope.nodes.map((node, nodeIndx) => {
            return {
              id: node.id,
              name: node.info.name,
              type: node.stats.mining ? 'miner' : 'sealer',
              pears: []
            }
          })
        });
				updateActiveNodes();
			}

			break;

		case "add":
			index = findIndex({id: data.id});

			// if( addNewNode(data) )
			// 	toastr['success']("New node "+ $scope.nodes[findIndex({id: data.id})].info.name +" connected!", "New node!");
			// else
			// 	toastr['info']("Node "+ $scope.nodes[index].info.name +" reconnected!", "Node is back!");

			break;

		// TODO: Remove when everybody updates api client to 0.0.12
		case "update":
			index = findIndex({id: data.id});

			if( index >= 0 && !_.isUndefined($scope.nodes[index]) && !_.isUndefined($scope.nodes[index].stats) )
			{
				if( !_.isUndefined($scope.nodes[index].stats.latency) )
					data.stats.latency = $scope.nodes[index].stats.latency;

				if( _.isUndefined(data.stats.hashrate) )
					data.stats.hashrate = 0;

				if( $scope.nodes[index].stats.block.number < data.stats.block.number )
				{
					let best = _.max($scope.nodes, node => {
						return parseInt(node.stats.block.number);
					}).stats.block;

					if (data.stats.block.number > best.number) {
						data.stats.block.arrived = _.now();
					} else {
						data.stats.block.arrived = best.arrived;
					}

					$scope.nodes[index].history = data.history;
				}

				$scope.nodes[index].stats = data.stats;

				if( !_.isUndefined(data.stats.latency) && _.get($scope.nodes[index], 'stats.latency', 0) !== data.stats.latency )
				{
					$scope.nodes[index].stats.latency = data.stats.latency;

					latencyFilter($scope.nodes[index]);
				}
        store.dispatch({
          type: 'NODE_UPDATE',
          id: $scope.nodes[index].id,
          data: $scope.nodes[index]
        });
				updateBestBlock();
			}

			break;

		case "block":
			index = findIndex({id: data.id});

			if( index >= 0 && !_.isUndefined($scope.nodes[index]) && !_.isUndefined($scope.nodes[index].stats) )
			{
				if( $scope.nodes[index].stats.block.number < data.block.number )
				{
					let best = _.max($scope.nodes, node => {
						return parseInt(node.stats.block.number);
					}).stats.block;

					if (data.block.number > best.number) {
						data.block.arrived = _.now();
					} else {
						data.block.arrived = best.arrived;
					}

					$scope.nodes[index].history = data.history;
				}
        store.dispatch({
          type: 'TRANSACTIONS_UPDATE',
          list: $scope.nodes[index].stats.block.transactions
        });
				$scope.nodes[index].stats.block = data.block;
				$scope.nodes[index].stats.propagationAvg = data.propagationAvg;
        store.dispatch({
          type: 'NODE_UPDATE',
          id: $scope.nodes[index].id,
          data: $scope.nodes[index]
        });
				updateBestBlock();
			}

			break;

		case "pending":
			index = findIndex({id: data.id});

			if( !_.isUndefined(data.id) && index >= 0 )
			{
				let node = $scope.nodes[index];

				if( !_.isUndefined(node) && !_.isUndefined(node.stats.pending) && !_.isUndefined(data.pending) ) {
					$scope.nodes[index].stats.pending = data.pending;
          store.dispatch({
            type: 'NODE_UPDATE',
            id: $scope.nodes[index].id,
            data: $scope.nodes[index]
          });
        }
			}

			break;

		case "stats":
			index = findIndex({id: data.id});

			if( !_.isUndefined(data.id) && index >= 0 )
			{
				let node = $scope.nodes[index];

				if( !_.isUndefined(node) && !_.isUndefined(node.stats) )
				{
					$scope.nodes[index].stats.active = data.stats.active;
					$scope.nodes[index].stats.mining = data.stats.mining;
					$scope.nodes[index].stats.hashrate = data.stats.hashrate;
					$scope.nodes[index].stats.peers = data.stats.peers;
					$scope.nodes[index].stats.gasPrice = data.stats.gasPrice;
					$scope.nodes[index].stats.uptime = data.stats.uptime;

					if( !_.isUndefined(data.stats.latency) && _.get($scope.nodes[index], 'stats.latency', 0) !== data.stats.latency )
					{
						$scope.nodes[index].stats.latency = data.stats.latency;

						latencyFilter($scope.nodes[index]);
					}
          store.dispatch({
            type: 'NODE_UPDATE',
            id: $scope.nodes[index].id,
            data: $scope.nodes[index]
          });
					updateActiveNodes();
				}
			}

			break;

		case "info":
			index = findIndex({id: data.id});

			if( index >= 0 )
			{
				$scope.nodes[index].info = data.info;

				if( _.isUndefined($scope.nodes[index].pinned) )
					$scope.nodes[index].pinned = false;

				// Init latency
				latencyFilter($scope.nodes[index]);
        store.dispatch({
          type: 'NODE_UPDATE',
          id: $scope.nodes[index].id,
          data: $scope.nodes[index]
        });
				updateActiveNodes();
			}

			break;

		case "blockPropagationChart":
			$scope.blockPropagationChart = data.histogram;
			$scope.blockPropagationAvg = data.avg;
      store.dispatch({
        type: 'NETWORK_UPDATE',
        data: {
          blockPropagation: $scope.blockPropagationChart
        }
      });
			break;

		case "uncleCount":
			$scope.uncleCount = data[0] + data[1];
			data.reverse();
			$scope.uncleCountChart = data;

			break;

		case "charts":
			if( !_.isEqual($scope.avgBlockTime, data.avgBlocktime) )
				$scope.avgBlockTime = data.avgBlocktime;

			if( !_.isEqual($scope.avgHashrate, data.avgHashrate) )
				$scope.avgHashrate = data.avgHashrate;

			if( !_.isEqual($scope.lastGasLimit, data.gasLimit) && data.gasLimit.length >= MAX_BINS )
				$scope.lastGasLimit = data.gasLimit;

			if( !_.isEqual($scope.lastBlocksTime, data.blocktime) && data.blocktime.length >= MAX_BINS )
				$scope.lastBlocksTime = data.blocktime;

			if( !_.isEqual($scope.difficultyChart, data.difficulty) && data.difficulty.length >= MAX_BINS )
				$scope.difficultyChart = data.difficulty;

			if( !_.isEqual($scope.blockPropagationChart, data.propagation.histogram) ) {
				$scope.blockPropagationChart = data.propagation.histogram;
				$scope.blockPropagationAvg = data.propagation.avg;
			}

			data.uncleCount.reverse();

			if( !_.isEqual($scope.uncleCountChart, data.uncleCount) && data.uncleCount.length >= MAX_BINS ) {
				$scope.uncleCount = data.uncleCount[data.uncleCount.length-2] + data.uncleCount[data.uncleCount.length-1];
				$scope.uncleCountChart = data.uncleCount;
			}

			if( !_.isEqual($scope.transactionDensity, data.transactions) && data.transactions.length >= MAX_BINS )
				$scope.transactionDensity = data.transactions;

			if( !_.isEqual($scope.gasSpending, data.gasSpending) && data.gasSpending.length >= MAX_BINS )
				$scope.gasSpending = data.gasSpending;

			if( !_.isEqual($scope.miners, data.miners) ) {
				$scope.miners = data.miners;
				getMinersNames();
			}
      store.dispatch({
        type: 'NETWORK_UPDATE',
        data: {
          avgBlockTime: $scope.avgBlockTime,
          blockTime: $scope.lastBlocksTime,
          avgHashRate: $scope.avgHashrate,
          wattLimit: $scope.lastGasLimit
        }
      });

			break;

		case "inactive":
			index = findIndex({id: data.id});

			if( index >= 0 )
			{
				if( !_.isUndefined(data.stats) )
					$scope.nodes[index].stats = data.stats;

				// toastr['error']("Node "+ $scope.nodes[index].info.name +" went away!", "Node connection was lost!");

				updateActiveNodes();
			}

			break;

		case "latency":
			if( !_.isUndefined(data.id) && !_.isUndefined(data.latency) )
			{
				index = findIndex({id: data.id});

				if( index >= 0 )
				{
					let node = $scope.nodes[index];

					if( !_.isUndefined(node) && !_.isUndefined(node.stats) && !_.isUndefined(node.stats.latency) && node.stats.latency !== data.latency )
					{
						node.stats.latency = data.latency;
						latencyFilter(node);
            store.dispatch({
              type: 'NODE_UPDATE',
              id: $scope.nodes[index].id,
              data: $scope.nodes[index]
            });
					}
				}
			}

			break;

		case "balance":
      // console.log(data);
			if( !_.isUndefined(data.id) && !_.isUndefined(data.balance) )
			{
				index = findIndex({id: data.id});

				if( index >= 0 )
				{
					let node = $scope.nodes[index];

					if( !_.isUndefined(node) && !_.isUndefined(node.info) && !_.isUndefined(node.info.balance) && node.info.balance !== data.balance )
					{
						node.info.balance = data.balance;
					}
					if( !_.isUndefined(node) && !_.isUndefined(node.info) && !_.isUndefined(node.info.balance_pending) && node.info.balance_pending !== data.balance_pending )
					{
						node.info.balance_pending = data.balance_pending;
					}
					if( !_.isUndefined(node) && !_.isUndefined(node.info) && !_.isUndefined(node.info.balance_latest) && node.info.balance_latest !== data.balance_latest )
					{
						node.info.balance_latest = data.balance_latest;
					}
          store.dispatch({
            type: 'REWARDS_UPDATE',
            id: $scope.nodes[index].id,
            data: data
          });
				}
			}

			break;

		case "client-ping":
			socket.emit('client-pong', {
				serverTime: data.serverTime,
				clientTime: _.now()
			});
			break;

    default:
      break;
	}

	// $scope.$apply();
}

const findIndex = search => _.findIndex($scope.nodes, search);


const getMinersNames = () => {
	if( $scope.miners.length > 0 )
	{
		_.forIn($scope.miners, (value, key) => {
			if(value.name !== false)
				return;

			if(value.miner === "0x0000000000000000000000000000000000000000")
				return;

			let name = _.result(_.find(_.pluck($scope.nodes, 'info'), 'coinbase', value.miner), 'name');

			if( !_.isUndefined(name) ) {
				$scope.miners[key].name = name;
      }
		});
	}
}

const addNewNode = data => {
	let index = findIndex({id: data.id});

	if( _.isUndefined(data.history) )
	{
		data.history = new Array(40);
		_.fill(data.history, -1);
	}

	if( index < 0 )
	{
		if( !_.isUndefined(data.stats) && _.isUndefined(data.stats.hashrate) )
		{
			data.stats.hashrate = 0;
		}

		data.pinned = false;

		$scope.nodes.push(data);

		return true;
	}

	data.pinned = ( !_.isUndefined($scope.nodes[index].pinned) ? $scope.nodes[index].pinned : false);

	if( !_.isUndefined($scope.nodes[index].history) )
	{
		data.history = $scope.nodes[index].history;
	}

	$scope.nodes[index] = data;

	updateActiveNodes();

	return false;
}

const updateActiveNodes = () => {
	updateBestBlock();
	$scope.nodesTotal = $scope.nodes.length;
	$scope.nodesActive = _.filter($scope.nodes, node => node.stats.active === true).length;
	$scope.upTimeTotal = _.reduce($scope.nodes, (total, node) => {
		return total + node.stats.uptime;
	}, 0) / $scope.nodes.length;
  store.dispatch({
    type: 'NETWORK_UPDATE',
    data: {
      uptime: $scope.upTimeTotal + '%',
      activeNodes: $scope.nodesActive + '/' + $scope.nodesTotal
    }
  });
}

const updateBestBlock = () => {
	if( $scope.nodes.length )
	{
		let bestBlock = _.max($scope.nodes, node => parseInt(node.stats.block.number)).stats.block.number;

		if( bestBlock !== $scope.bestBlock )
		{
			$scope.bestBlock = bestBlock;
			$scope.bestStats = _.max($scope.nodes, node => parseInt(node.stats.block.number)).stats;

			$scope.lastBlock = $scope.bestStats.block.arrived;
			$scope.lastDifficulty = $scope.bestStats.block.difficulty;
      store.dispatch({
        type: 'NETWORK_UPDATE',
        data: {
          bestBlock: $scope.bestBlock,
          lastBlock: $scope.lastBlock
        }
      });
		}
	}
}

const latencyFilter = node => {
	if( _.isUndefined(node.readable) )
		node.readable = {};

	if( _.isUndefined(node.stats) ) {
		node.readable.latencyClass = 'text-danger';
		node.readable.latency = 'offline';
	}

	if (node.stats.active === false)
	{
		node.readable.latencyClass = 'text-danger';
		node.readable.latency = 'offline';
	}
	else
	{
		if (node.stats.latency <= 100)
			node.readable.latencyClass = 'text-success';

		if (node.stats.latency > 100 && node.stats.latency <= 1000)
			node.readable.latencyClass = 'text-warning';

		if (node.stats.latency > 1000)
			node.readable.latencyClass = 'text-danger';

		node.readable.latency = node.stats.latency + ' ms';
	}
}

// very simple xss filter
const xssFilter = obj => {
	if(_.isArray(obj)) {
		return _.map(obj, xssFilter);

	} else if(_.isObject(obj)) {
		return _.mapValues(obj, xssFilter);

	} else if(_.isString(obj)) {
		return obj.replace(/\< *\/* *script *>*/gi,'').replace(/javascript/gi,'');
	} else
		return obj;
}


export default store;
