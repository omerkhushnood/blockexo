const nodeInfoReducer = (
  state = {
    nodes: [
      // {
      //   id: null,
      //   data: {
      //     name: null,
      //     type: null,
      //     latency: null,
      //     peersCount: null,
      //     pendingTransactionsCount: null,
      //     lastBlock: null,
      //     blockHash: null,
      //     totalDifficulty: null,
      //     blockTransactions: null,
      //     lastBlockTime: null,
      //     propagationTime: null,
      //     averagePropagationTime: null,
      //     uptime: null
      //   }
      // }
    ]
  },
  action
) => {
  let returnable = state;
  switch (action.type) {
    case 'NODEINFO_UPDATE':
      returnable = addOrUpdateNodeInfo(state, action);
      break;
    default:
      returnable = state;
  }
  return returnable;
}

const addOrUpdateNodeInfo = (state, action) => {
  if (action.id == null) {
    return state;
  }
  let currentNode = state.nodes.find(node => node.id === action.id);
  if (currentNode) {
    currentNode.data = mergeObjects(currentNode.data, action.data);
  }
  else {
    state.nodes = [...state.nodes, {
      id: action.id,
      data: action.data
    }];
  }
  return state;
}

const mergeObjects = (obj, ...otherObjects) => {
  for (let i=1; i<otherObjects.length; i++) {
    for (let prop in otherObjects[i]) {
      let val = otherObjects[i][prop];
      if (typeof val == "object") // this also applies to arrays or null!
        mergeObjects(obj[prop], val);
      else
        obj[prop] = val;
    }
  }
  return obj;
}


export default nodeInfoReducer;
