const rewardsReducer = (
  state = {
    videoCoinNode0: {name: 'Video-Coin-Node-0',balance: '0.00', balance_pending: '0.00', balance_latest: '0.00'},
    videoCoinNode1: {name: 'Video-Coin-Node-1',balance: '0.00', balance_pending: '0.00', balance_latest: '0.00'},
    videoCoinNode2: {name: 'Video-Coin-Node-2',balance: '0.00', balance_pending: '0.00', balance_latest: '0.00'},
    videoCoinNode3: {name: 'Video-Coin-Node-3',balance: '0.00', balance_pending: '0.00', balance_latest: '0.00'},
    videoCoinNode4: {name: 'Video-Coin-Node-4',balance: '0.00', balance_pending: '0.00', balance_latest: '0.00'}
  },
  action
) => {
  let returnable = state;
  switch (action.type) {
    case 'REWARDS_UPDATE':
      returnable = {
        ...state,
        [action.id]: action.data
      }
      break;
    default:
      returnable = state;
  }
  return returnable;
}

export default rewardsReducer;
