const nodesReducer = (
  state = {
    list: [

    ]
  },
  action
) => {
  let returnable = state;
  switch (action.type) {
    case 'NODES_UPDATE':
      returnable = {
        list: action.nodes
      }
      break;
    case 'NODE_UPDATE':
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
  let currentNode = state.list.find(node => node.id === action.id);
  if (currentNode) {
    currentNode = mergeObjects(currentNode, action.data);
  }
  else {
    state.list = [...state.list, action.data];
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

export default nodesReducer;
