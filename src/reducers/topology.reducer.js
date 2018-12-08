const topologyReducer = (
  state = {
    nodes: [

    ]
  },
  action
) => {
  let returnable = state;
  switch (action.type) {
    case 'TOPOLOGY_UPDATE':
      returnable = {
        nodes: action.nodes
      }
      break;
    default:
      returnable = state;
  }
  return returnable;
}

export default topologyReducer;
