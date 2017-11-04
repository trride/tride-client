import debounce from "p-debounce";

export const findPOI = (lat, long, name) => {
  console.log(`finding POI with name ${name}`);
  return fetch(
    `http://tride-api.now.sh/points?lat=${lat}&long=${long}&name=${name}`
  )
    .then(res => res.json())
    .catch(() => {
      points: [];
    });
};

export const debouncedFindPOI = debounce(findPOI, 1000);
