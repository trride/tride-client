const SELF_POSITION_CHANGED = "tride/SELF_POSITION_CHANGED";
const SELF_FAIL_GET_CURRENT_LOCATION = "@tride/SELF_FAIL_GET_CURRENT_LOCATION";

export function updatePosition({ coords, timestamp }) {
  return {
    type: SELF_POSITION_CHANGED,
    coords,
    timestamp
  };
}

export function gpsErrorHandler() {
  const timestamp = Date.now();
  return {
    type: SELF_FAIL_GET_CURRENT_LOCATION,
    timestamp
  };
}
const initialTime = Date.now();
const initialState = {
  coords: {
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    latitude: 0,
    longitude: 0,
    speed: 0
  },
  timestamp: initialTime,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELF_POSITION_CHANGED:
      return {
        coords: action.coords,
        timestamp: action.timestamp,
        error: false
      };
    case SELF_FAIL_GET_CURRENT_LOCATION:
      return {
        coords: initialState.coords,
        timestamp: action.timestamp,
        error: true
      };
    default:
      return state;
  }
}
