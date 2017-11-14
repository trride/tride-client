const {
  debouncedFindPOI,
  findCoordsFromPOI,
  getPriceComparisons,
  manualRide,
  getFastest
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

const REQUEST_RIDE = "@tride/main/REQUEST_RIDE";
const REQUEST_RIDE_SUCCESS = "@tride/main/REQUEST_RIDE_SUCCESS";
const REQUEST_RIDE_ERROR = "@tride/main/REQUEST_RIDE_ERROR";
const REQUEST_RIDE_DISMISS = "@tride/main/REQUEST_RIDE_DISMISS";

const UPDATE_RIDE_STATUS = "@tride/main/UPDATE_RIDE_STATUS";
const UPDATE_RIDE_STATUS_LOADING = "@tride/main/UPDATE_RIDE_STATUS_LOADING";
const UPDATE_RIDE_STATUS_ERROR = "@tride/main/UPDATE_RIDE_STATUS_ERROR";
const UPDATE_RIDE_STATUS_DISMISS = "@tride/main/UPDATE_RIDE_STATUS_DISMISS";

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
  rideId: {
    notAsked: true,
    isLoading: false,
    data: {},
    hasError: false
  },
  rideStatus: {
    notAsked: true,
    isLoading: false,
    data: {},
    hasError: false
  }
};

export function updatePriceComparisons(estimates) {
  return {
    type: UPDATE_PRICE_COMPARISONS,
    priceComparisons: {
      data: estimates
    }
  };
}

export function failingPriceComparisons(err) {
  return {
    type: UPDATE_PRICE_COMPARISONS_ERROR,
    priceComparisons: {
      hasError: err
    }
  };
}

export function loadingPriceComparisons() {
  return {
    type: UPDATE_PRICE_COMPARISONS_LOADING
  };
}

export function dismissPriceComparisons() {
  return {
    type: UPDATE_PRICE_COMPARISONS_DISMISS
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

export function requestRide() {
  return {
    type: REQUEST_RIDE
  };
}

export function requestRideSuccess(rideId) {
  return {
    type: REQUEST_RIDE_SUCCESS,
    rideId: {
      data: rideId
    }
  };
}

export function requestRideFail(err) {
  return {
    type: REQUEST_RIDE_ERROR,
    rideId: {
      hasError: err
    }
  };
}

export function requestRideDismiss() {
  return {
    type: REQUEST_RIDE_DISMISS
  };
}

export function updateRideStatus(rideStatus) {
  return {
    type: UPDATE_RIDE_STATUS,
    rideStatus: {
      data: rideStatus
    }
  };
}

export function loadingRideStatus() {
  return {
    type: UPDATE_RIDE_STATUS_LOADING
  };
}

export function failingRideStatus(err) {
  return {
    type: UPDATE_RIDE_STATUS_ERROR,
    rideStatus: {
      hasError: err
    }
  };
}

export function dismissRideStatus() {
  return {
    type: UPDATE_RIDE_STATUS_DISMISS
  };
}

export function getSuggestedPlaces(latitude, longitude, text) {
  return async dispatch => {
    dispatch(updateSearchBoxText(text));
    dispatch(loadingSuggestedPlaces());
    dispatch(dismissSelectedPlace());
    dispatch(dismissPriceComparisons());
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
      dispatch(comparePrices(coords));
    }
  };
}

export function comparePrices(to) {
  return async (dispatch, getState) => {
    const { gps: { coords } } = getState();
    dispatch(loadingPriceComparisons());
    const { estimates, error } = await getPriceComparisons(coords, to);
    if (error) {
      dispatch(failingPriceComparisons(error));
    } else {
      dispatch(updatePriceComparisons(estimates));
    }
  };
}

export function findMyRide({ service, key }) {
  console.log("finding a ride");
  return async (dispatch, getState) => {
    const { gps: { coords }, main: { selectedPlace } } = getState();
    dispatch(dismissPriceComparisons());
    dispatch(requestRide());
    const { requestId } = await manualRide(
      service,
      key,
      { latitude: coords.latitude, longitude: coords.longitude },
      {
        latitude: selectedPlace.data.latitude,
        longitude: selectedPlace.data.longitude
      }
    );
    dispatch(requestRideSuccess(requestId));
  };
}

// export function abortRide ({service, requestId}) {
//   return async (dispatch, getState) => {
//     const {cancelled} = await
//   }
// }

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
          ...action.suggestedPlaces
        }
      };
    case UPDATE_SUGGESTED_PLACES_DISMISS:
      return {
        ...state,
        suggestedPlaces: initialState.suggestedPlaces
      };
    case UPDATE_PRICE_COMPARISONS:
      return {
        ...state,
        priceComparisons: {
          ...initialState.priceComparisons,
          notAsked: false,
          ...action.priceComparisons
        }
      };
    case UPDATE_PRICE_COMPARISONS_LOADING:
      return {
        ...state,
        priceComparisons: {
          ...initialState.priceComparisons,
          notAsked: false,
          isLoading: true
        }
      };
    case UPDATE_PRICE_COMPARISONS_ERROR:
      return {
        ...state,
        priceComparisons: {
          ...initialState.priceComparisons,
          notAsked: false,
          ...action.priceComparisons
        }
      };
    case UPDATE_PRICE_COMPARISONS_DISMISS:
      return {
        ...state,
        priceComparisons: initialState.priceComparisons
      };
    case REQUEST_RIDE:
      return {
        ...state,
        rideId: {
          ...initialState.rideId,
          notAsked: false,
          isLoading: true
        }
      };
    case REQUEST_RIDE_SUCCESS:
      return {
        ...state,
        rideId: {
          ...initialState.rideId,
          notAsked: false,
          data: action.rideId.data
        }
      };
    case REQUEST_RIDE_ERROR:
      return {
        ...state,
        rideId: {
          ...initialState.rideId,
          notAsked: false,
          hasError: action.rideId.hasError
        }
      };
    case REQUEST_RIDE_DISMISS:
      return {
        ...state,
        rideId: initialState.rideId
      };

    case UPDATE_RIDE_STATUS:
      return {
        ...state,
        rideStatus: {
          ...initialState.rideStatus,
          notAsked: false,
          data: action.rideStatus.data
        }
      };
    case UPDATE_RIDE_STATUS_LOADING:
      return {
        ...state,
        rideStatus: {
          ...initialState.rideStatus,
          notAsked: false,
          isLoading: true
        }
      };
    case UPDATE_PRICE_COMPARISONS_ERROR:
      return {
        ...state,
        rideStatus: {
          ...initialState.rideStatus,
          notAsked: false,
          hasError: action.rideStatus.hasError
        }
      };
    case UPDATE_PRICE_COMPARISONS_DISMISS:
      return {
        ...state,
        rideStatus: initialState.rideStatus
      };
    default:
      return state;
  }
}
