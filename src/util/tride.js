import debounce from "p-debounce";

const baseURL = "https://tride-api.now.sh/";

const tride = (endpoint, opts = {}) => {
  const url = `${baseURL}${endpoint}`;
  console.log(url);
  return fetch(url, opts)
    .then(async res => {
      if (res.ok) {
        return res.json();
      }
      console.log(await res.json());
      throw new Error("Network response was not ok.");
    })
    .catch(err => {
      console.log("errored");
      console.log(err);
      return { error: { message: err.message } };
    });
};

export const findPOI = (lat, long, name) =>
  name === ""
    ? Promise.resolve({ points: [] })
    : tride(`points?lat=${lat}&long=${long}&name=${name}`);

export const debouncedFindPOI = debounce(findPOI, 500);

export const findCoordsFromPOI = placeid => tride(`coords?placeid=${placeid}`);

export const getPriceComparisons = (start, end) =>
  tride(
    `estimate?` +
      `start_lat=${start.latitude}&start_long=${start.longitude}` +
      `&end_lat=${end.latitude}&end_long=${end.longitude}`
  );

export const reverseGeo = ({ latitude, longitude }) =>
  tride(`location?latitude=${latitude}&longitude=${longitude}`);

export const manualRide = (service, key, start, end) => {
  const payload = {
    requestKey: { key },
    itinerary: {
      start: { lat: start.latitude, long: start.longitude },
      end: { lat: end.latitude, long: end.longitude }
    }
  };
  console.log(payload);
  const opts = {
    method: "post",
    body: JSON.stringify(payload)
  };
  const services = ["gojek", "grab", "uber"];
  const lowercaseService = service.toLowerCase();
  if (!services.includes(lowercaseService)) {
    return { error: { message: "Service not found" } };
  } else {
    return tride(`rides/${lowercaseService}`, opts);
  }
};

export const deleteRideByTrideId = trideId =>
  tride(`rides/${trideId}`, { method: "DELETE" });

export const getFastest = (services, itinerary) => {};
