const networkStatsReducer = (
  state = {
    bestBlock: 1,
    lastBlock: '2 s ago',
    avgBlockTime: '5.3 s',
    avgHashRate: '5.3 s',
    blockTime: [23,4,13,54,67,43,23,4,13,54,67,43,23,4,13,54,67,43],
    wattLimit: 100,
    pageLatency: '112 ms',
    uptime: '100%',
    activeNodes: '1/5',
    blockPropagation: [23,4,13,54,67,43,23,4,13,54,67,43,23,4,13,54,67,43]
  },
  action
) => {
  let returnable = state;
  switch (action.type) {
    case 'NETWORK_UPDATE':
      returnable = {...state, ...action.data};
      break;
    default:
      returnable = state;
  }
  return returnable;
}

export default networkStatsReducer;
