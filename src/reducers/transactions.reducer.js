const transactionsReducer = (
  state = {
    list: [

    ]
  },
  action
) => {
  let returnable = state;
  switch (action.type) {
    case 'TRANSACTIONS_UPDATE':
      returnable = {
        list: action.list
      }
      break;
    default:
      returnable = state;
  }
  return returnable;
}

export default transactionsReducer;
