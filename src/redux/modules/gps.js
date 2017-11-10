const SELF_UPDATE_GPS = "@tride/SELF_UPDATE_GPS";
const SELF_UPDATE_GPS_FAIL = "@tride/SELF_UPDATE_GPS_FAIL";

const SELF_REVERSE_GEO = "@tride/gps/SELF_REVERSE_GEO";

import { reverseGeo } from "../../util/tride";

export function updateGPS({ coords, timestamp }) {
  return {
    type: SELF_UPDATE_GPS,
    coords,
    timestamp
  };
}

export function errorUpdateGPS() {
  const timestamp = Date.now();
  return {
    type: SELF_UPDATE_GPS_FAIL,
    timestamp
  };
}

export const handleUpdateGPS = data => {
  return async (dispatch, getState) => {
    dispatch(updateGPS(data));
    const { gps: { coords } } = getState();
    const { name, error } = await reverseGeo(coords);
    if (!error) {
      dispatch(updateSelfReverse(name));
    }
  };
};

export function updateSelfReverse(name) {
  return {
    type: SELF_REVERSE_GEO,
    name: {
      notAsked: false,
      isLoading: false,
      hasError: false,
      data: name
    }
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
  error: false,
  name: {
    notAsked: true,
    isLoading: false,
    hasError: false,
    data: ""
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELF_UPDATE_GPS:
      return {
        ...state,
        coords: action.coords,
        timestamp: action.timestamp,
        error: false
      };
    case SELF_UPDATE_GPS_FAIL:
      return {
        ...state,
        coords: initialState.coords,
        timestamp: action.timestamp,
        error: true
      };
    case SELF_REVERSE_GEO:
      return {
        ...state,
        name: action.name
      };
    default:
      return state;
  }
}
