let initialState = {
  msg: 'hay'
}

export default (state = initialState, actions) => {
  switch (actions.type) {
    case "":
      return state;
    default:
      return state;
  }
}
