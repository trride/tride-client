const {
  debouncedFindPOI,
  findCoordsFromPOI,
  getPriceComparisons
} = require("../../util/tride");

const SELECT_PLACE_FROM_SUGGESTIONS = "@tride/SELECT_PLACE_FROM_SUGGESTIONS";
const SELECT_PLACE_FROM_SUGGESTIONS_LOADING =
  "@tride/SELECT_PLACE_FROM_SUGGESTIONS_LOADING";
const SELECT_PLACE_FROM_SUGGESTIONS_ERROR =
  "@tride/SELECT_PLACE_FROM_SUGGESTIONS_ERROR";
const SELECT_PLACE_FROM_SUGGESTIONS_DISMISS =
  "@tride/SELECT_PLACE_FROM_SUGGESTIONS_DISMISS";

const UPDATE_SEARCH_BOX_TEXT = "@tride/UPDATE_SEARCH_BOX_TEXT";

const UPDATE_SUGGESTED_PLACES = "@tride/UPDATE_SUGGESTED_PLACES";
const UPDATE_SUGGESTED_PLACES_LOADING =
  "@tride/UPDATE_SUGGESTED_PLACES_LOADING";
const UPDATE_SUGGESTED_PLACES_ERROR = "@tride/UPDATE_SUGGESTED_PLACES_ERROR";
const UPDATE_SUGGESTED_PLACES_DISMISS =
  "@tride/UPDATE_SUGGESTED_PLACES_DISMISS";

const UPDATE_PRICE_COMPARISONS = "@tride/UPDATE_PRICE_COMPARISONS";
const UPDATE_PRICE_COMPARISONS_LOADING =
  "@tride/UPDATE_PRICE_COMPARISONS_LOADING";
const UPDATE_PRICE_COMPARISONS_ERROR = "@tride/UPDATE_PRICE_COMPARISONS_ERROR";
const UPDATE_PRICE_COMPARISONS_DISMISS =
  "@tride/UPDATE_PRICE_COMPARISONS_DISMISS";

const initialState = {
  selectedPlace: {
    notAsked: true,
    isLoading: false,
    data: {},
    hasError: false
  },
  searchBoxText: "",
  suggestedPlaces: {
    notAsked: true,
    isLoading: false,
    data: [],
    hasError: false
  },
  priceComparisons: {
    notAsked: true,
    isLoading: false,
    data: [],
    hasError: false
  },
  rideStatus: {
    notAsked: true,
    isLoading: false,
    data: null,
    hasError: false
  }
};

export function updatePriceComparisons(estimates) {
  return {
    type: UPDATE_PRICE_COMPARISONS,
    priceComparisons: {
      notAsked: false,
      isLoading: false,
      hasError: false,
      data: estimates
    }
  };
}

export function updateSelectedPlace({ name, address, latitude, longitude }) {
  return {
    type: SELECT_PLACE_FROM_SUGGESTIONS,
    selectedPlace: {
      data: {
        name,
        address,
        latitude,
        longitude
      }
    }
  };
}

export function failingSelectedPlace(err) {
  return {
    type: SELECT_PLACE_FROM_SUGGESTIONS_ERROR,
    selectedPlace: {
      error: err
    }
  };
}

export function loadingSelectedPlace() {
  return {
    type: SELECT_PLACE_FROM_SUGGESTIONS_LOADING
  };
}

export function dismissSelectedPlace() {
  return {
    type: SELECT_PLACE_FROM_SUGGESTIONS_DISMISS
  };
}

export function updateSearchBoxText(text) {
  return {
    type: UPDATE_SEARCH_BOX_TEXT,
    searchBoxText: text
  };
}

export function updateSuggestedPlaces(points) {
  return {
    type: UPDATE_SUGGESTED_PLACES,
    suggestedPlaces: {
      data: points
    }
  };
}

export function loadingSuggestedPlaces() {
  return {
    type: UPDATE_SUGGESTED_PLACES_LOADING
  };
}

export function failingSuggestedPlaces(err) {
  return {
    type: UPDATE_SUGGESTED_PLACES_ERROR,
    suggestedPlaces: {
      hasError: err
    }
  };
}

export function dismissSuggestedPlaces() {
  return {
    type: UPDATE_SUGGESTED_PLACES_DISMISS
  };
}

export function getSuggestedPlaces(latitude, longitude, text) {
  return async dispatch => {
    dispatch(updateSearchBoxText(text));
    dispatch(loadingSuggestedPlaces());
    const { points, error } = await debouncedFindPOI(latitude, longitude, text);
    if (text === "") {
      return dispatch(dismissSuggestedPlaces());
    }
    if (!error) {
      dispatch(updateSuggestedPlaces(points));
    } else {
      dispatch(failingSuggestedPlaces(error));
    }
  };
}

export function selectPlaceFromSuggestions(place) {
  return async (dispatch, getState) => {
    dispatch(updateSearchBoxText(place.name));
    dispatch(dismissSuggestedPlaces());
    dispatch(loadingSelectedPlace());
    const { coords, error } = await findCoordsFromPOI(place.placeid);
    if (error) {
      return dispatch(failingSelectedPlace(error));
    } else {
      dispatch(
        updateSelectedPlace({
          name: coords.name,
          address: coords.address,
          latitude: coords.latitude,
          longitude: coords.longitude
        })
      );
      const { gps } = getState();
      const { estimates, error } = await getPriceComparisons(
        gps.coords,
        coords
      );
      if (error) {
        console.error(error);
      } else {
        dispatch(updatePriceComparisons(estimates));
      }
    }
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_PLACE_FROM_SUGGESTIONS:
      const { data } = action.selectedPlace;
      return {
        ...state,
        selectedPlace: {
          notAsked: false,
          isLoading: false,
          hasError: false,
          data
        }
      };
    case SELECT_PLACE_FROM_SUGGESTIONS_LOADING:
      return {
        ...state,
        selectedPlace: {
          ...initialState.selectedPlace,
          notAsked: false,
          isLoading: true
        }
      };
    case SELECT_PLACE_FROM_SUGGESTIONS_ERROR:
      return {
        ...state,
        selectedPlace: {
          ...initialState.selectedPlace,
          notAsked: false,
          ...action.selectedPlace
        }
      };
    case SELECT_PLACE_FROM_SUGGESTIONS_DISMISS:
      return {
        ...state,
        selectedPlace: initialState.selectedPlace
      };
    case UPDATE_SEARCH_BOX_TEXT:
      return {
        ...state,
        searchBoxText: action.searchBoxText
      };
    case UPDATE_SUGGESTED_PLACES:
      return {
        ...state,
        suggestedPlaces: {
          ...action.suggestedPlaces,
          notAsked: false,
          isLoading: false,
          hasError: false
        }
      };
    case UPDATE_SUGGESTED_PLACES_LOADING:
      return {
        ...state,
        suggestedPlaces: {
          ...initialState.suggestedPlaces,
          notAsked: false,
          isLoading: true
        }
      };
    case UPDATE_SUGGESTED_PLACES_ERROR:
      return {
        ...state,
        suggestedPlaces: {
          ...initialState.suggestedPlaces,
          notAsked: false,
          isLoading: false,
          ...action.suggestedPlaces
        }
      };
    case UPDATE_SUGGESTED_PLACES_DISMISS:
      return {
        ...state,
        suggestedPlaces: { ...initialState.suggestedPlaces }
      };
    case UPDATE_PRICE_COMPARISONS:
      return {
        ...state,
        priceComparisons: action.priceComparisons
      };
    default:
      return state;
  }
}
