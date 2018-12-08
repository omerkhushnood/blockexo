import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import store from './bootstrap';


// setTimeout(() => {
//   store.dispatch({
//     type: 'TOPOLOGY_UPDATE',
//     nodes: [
//       {
//         id: 1,
//         name: 'VCN-Miner-1',
//         type: 'miner',
//         pears: [2,4,5]
//       },
//       {
//         id: 2,
//         name: 'Sealer-Node-1',
//         type: null,
//         pears: [3,4]
//       },
//       {
//         id: 3,
//         name: 'VCN-Miner-2',
//         type: 'miner',
//         pears: [4,5]
//       },
//       {
//         id: 4,
//         name: 'Sealer-Node-2',
//         type: null,
//         pears: []
//       },
//       {
//         id: 5,
//         name: 'Sealer-Node-3',
//         type: null,
//         pears: []
//       }
//     ]
//   });
// }, 1500);
//
// setTimeout(() => {
//   store.dispatch({
//     type: 'TRANSACTIONS_UPDATE',
//     list: [
//       // { address: '0x651FG6SD1G61SD5F1G61SD6F1G65S1DF65G16SDF51G6SD1FG6DS1G56' },
//       // { address: '0xSBGBS651DFG651DS6F51G6S1DFG1S6DF1G65S1DF6GS65DF1G65S1DFF' },
//       // { address: '0x51SD6F1G6SD1F6G51S6D51FG651SDF5G1651G65165R1651D1SG65D1F' },
//       // { address: '0x7SDFG85R189ER7TWER1G21D16SG54FS48RE4TG5SD1G6SFG1S61DFG5S' },
//       // { address: '0x98R7TW6E5R65DFGSD1FG61E21R2G1D1FSG65E6GS1RE654GDFGSDF65E' }
//     ]
//   });
// }, 3000);
//
// setTimeout(() => {
//   store.dispatch({
//     type: 'REWARDS_UPDATE',
//     miners: [
//       { id: 1, name: 'VCN-Miner-1', balance: '0.00' },
//       { id: 2, name: 'VCN-Miner-2', balance: '0.00' }
//     ]
//   });
// }, 1000);
//
// setTimeout(() => {
//   store.dispatch({
//     type: 'NODEINFO_UPDATE',
//     id: 1,
//     data: {
//       name: 'VCN-Miner-1',
//       type: 'Geth/v1.8.18-unstable-1ff152f3/linux-amd64/go1.11.2',
//       latency: '44 ms',
//       peersCount: '3',
//       pendingTransactionsCount: '2',
//       lastBlock: '15',
//       blockHash: 'd4b434c0...c9966522',
//       totalDifficulty: '3622',
//       blockTransactions: '7',
//       lastBlockTime: '21 s ago',
//       propagationTime: '470 ms',
//       averagePropagationTime: '327 ms',
//       uptime: '100%'
//     }
//   });
// }, 1000);
//
// setTimeout(() => {
//   store.dispatch({
//     type: 'NETWORK_UPDATE',
//     data: {
//       bestBlock: 1,
//       lastBlock: '2 s ago',
//       avgBlockTime: '5.3 s',
//       avgHashRate: '5.3 s',
//       blockTime: [23,4,13,54,67,43,23,4,13,54,67,43,23,4,13,54,67,43],
//       wattLimit: 100,
//       pageLatency: '112 ms',
//       uptime: '100%',
//       activeNodes: '1/5',
//       blockPropagation: [23,4,13,54,67,43,23,4,13,54,67,43,23,4,13,54,67,43]
//     }
//   });
// }, 2000);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
