const SELECT_PLACE_FROM_SUGGESTIONS = "@tride/SELECT_PLACE_FROM_SUGGESTIONS";

const initialState = {
  selectedPlace: {}
};

export function selectPlace({ name, address, latitude, longitude }) {
  return {
    type: SELECT_PLACE_FROM_SUGGESTIONS,
    place: {
      name,
      address,
      latitude,
      longitude
    }
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
