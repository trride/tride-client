const { debouncedFindPOI } = require("../../util/tride");

const SELECT_PLACE_FROM_SUGGESTIONS = "@tride/SELECT_PLACE_FROM_SUGGESTIONS";
const UPDATE_SEARCH_BOX_TEXT = "@tride/UPDATE_SEARCH_BOX_TEXT";
const UPDATE_SUGGESTED_PLACES = "@tride/UPDATE_SUGGESTED_PLACES";

const initialState = {
  selectedPlace: {},
  searchBoxText: "",
  suggestedPlaces: []
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

export function updateSearchBoxText(text) {
  return {
    type: UPDATE_SEARCH_BOX_TEXT,
    selectedPlace: {},
    searchBoxText: text
  };
}

export function updateSuggestedPlaces(points) {
  return {
    type: UPDATE_SUGGESTED_PLACES,
    suggestedPlaces: points
  };
}

export function getSuggestedPlaces(latitude, longitude, text) {
  return async dispatch => {
    dispatch(updateSearchBoxText(text));
    const { points, error } = await debouncedFindPOI(latitude, longitude, text);
    if (!error) {
      dispatch(updateSuggestedPlaces(points));
    } else {
      dispatch(updateSuggestedPlaces([]));
    }
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_PLACE_FROM_SUGGESTIONS:
      const { name, address, latitude, longitude } = action.place;
      return {
        ...state,
        selectedPlace: {
          name,
          address,
          latitude,
          longitude
        },
        searchBoxText: name
      };
    case UPDATE_SEARCH_BOX_TEXT:
      return {
        ...state,
        selectedPlace: action.selectedPlace,
        searchBoxText: action.searchBoxText
      };
    case UPDATE_SUGGESTED_PLACES:
      return {
        ...state,
        suggestedPlaces: action.suggestedPlaces
      };
    default:
      return state;
  }
}
