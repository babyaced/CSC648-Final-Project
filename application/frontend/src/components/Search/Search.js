import React from "react";
import { useHistory } from "react-router-dom";

function Search({
  searchLocationLat,
  searchLocationLng,
  searchTerm,
  searchCategory,
  selectedPrefilter,
}) {
  // const history = useHistory();
  const location = {};
  if (searchLocationLat == null || searchLocationLng == null) {
    navigator.geolocation.getCurrentPosition((position) => {
      location = {
        pathname: "/MapSearch",
        state: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          searchTermParam: searchTerm,
          searchCategoryParam: searchCategory,
          prefilter: selectedPrefilter,
        },
      };
      // history.push(location)
    });
  } else {
    location = {
      pathname: "/MapSearch",
      state: {
        lat: searchLocationLat,
        lng: searchLocationLng,
        searchTermParam: searchTerm,
        searchCategoryParam: searchCategory,
        prefilter: selectedPrefilter,
      },
    };
    //   history.push(location)
  }
  return location;
}

export default Search;
