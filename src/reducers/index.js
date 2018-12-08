import { combineReducers } from 'redux';
import transactionsReducer from './transactions.reducer';
import topologyReducer from './topology.reducer';
import rewardsReducer from './rewards.reducer';
import nodeInfoReducer from './nodeInfo.reducer';
import networkStatsReducer from './networkStats.reducer';
import nodesReducer from './nodes.reducer';

const reducers = combineReducers({
  transactions: transactionsReducer,
  topology: topologyReducer,
  rewards: rewardsReducer,
  nodeInfo: nodeInfoReducer,
  networkStats: networkStatsReducer,
  nodes: nodesReducer
})

export default reducers;
