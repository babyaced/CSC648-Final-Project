import React, { useEffect, useMemo, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { useThrottle } from "@react-hook/throttle";
import { matchSorter } from "match-sorter";

import styles from "./SearchBar.module.css";

//Import Icons
// import Search from  "../../assets/icons/created/Search.svg"

//Import Custom Hooks/ Functions
import useWindowSize from "../Hooks/useWindowSize";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

//For search input and suggestions
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox";
import useTypeOptions from "../DropdownOptions/useTypeOptions";
import useBusinessCategoryOptions from "../DropdownOptions/useBusinessCategoryOptions";
import useDogBreedOptions from "../DropdownOptions/useDogBreedOptions";
import useCatBreedOptions from "../DropdownOptions/useCatBreedOptions";

//Google Maps
const libraries = ["places"];

function SearchBar({ cssClass, closeMobileSearchBar }) {
  let [typeOptions] = useTypeOptions();
  let [businessCategoryOptions] = useBusinessCategoryOptions();
  let [dogBreedOptions] = useDogBreedOptions();
  let [catBreedOptions] = useCatBreedOptions();

  // console.log("TypeOptions: ", typeOptions);
  // console.log("BusinessCategoryOptions: ", businessCategoryOptions);
  // console.log("dogBreedOptions: ", dogBreedOptions);
  // console.log("catBreedOptions: ", catBreedOptions);

  const history = useHistory();
  const windowSize = useWindowSize();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("Pets");

  const [searchLocationLat, setSearchLocationLat] = useState(null);
  const [searchLocationLng, setSearchLocationLng] = useState(null);

  const [selectedPrefilter, setSelectedPrefilter] = useState({});

  const prefilterObject = useRef({});

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 37.773972, lng: () => -122.431297 },
      radius: 200 * 1000,
    },
  });

  function search() {
    console.log("searching");
    console.log(searchCategory)

    if ((searchLocationLat == null || searchLocationLng == null) && searchCategory !== 'Pet Owners') {
      console.log('searching with current location')
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          pathname: "/MapSearch",
          state: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            searchTermParam: searchTerm,
            searchCategoryParam: searchCategory,
            prefilter: selectedPrefilter,
          },
        };
        history.push(location);
      });
    } else {
      console.log('searching with address')
      const location = {
        pathname: "/MapSearch",
        state: {
          lat: searchLocationLat,
          lng: searchLocationLng,
          searchTermParam: searchTerm,
          searchCategoryParam: searchCategory,
          prefilter: selectedPrefilter,
        },
      };
      history.push(location);
    }
  }

  const results = useCategoryMatch(searchTerm);

  function useCategoryMatch(searchTerm) {
    const throttledTerm = useThrottle(searchTerm, 100); //need to throttle function because it runs whenever searchTerm is set
    let filters = [];
    if (searchCategory === "Pets") {
      //set autocompletable prefilters to pet type and breed
      filters = typeOptions.concat(dogBreedOptions, catBreedOptions);
    }
    if (searchCategory === "Shelters") {
      //set autocompletable prefilters to pet type
      filters = typeOptions;
    }
    if (searchCategory === "Businesses") {
      //set autocompletable prefilters to business type
      filters = businessCategoryOptions;
    }
    return useMemo(
      () =>
        searchTerm.trim() === ""
          ? null
          : matchSorter(filters, searchTerm, {
            keys: [(filter) => `${filter.label}`],
          }),
      [throttledTerm]
    );
  }

  return (
    <>
      <div className={styles[cssClass]}>
        <span className={styles["search-category-dropdown"]}>
          <select
            name="search-category"
            id="search-category"
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="Pets">Pets</option>
            <option value="Businesses">Businesses</option>
            <option value="Shelters">Shelters</option>
            <option value="Pet Owners">Pet Owners</option>
          </select>
        </span>
        <Combobox
          className={styles["term-input-container"]}
          onSelect={(value) => {
            setSelectedPrefilter(prefilterObject.current[value]); //set prefilter to selected one to pass to mapsearch page
            setSearchTerm("");
          }}
        >
          <ComboboxInput
            className={styles["searchbar-term-input"]}
            onChange={(event) => setSearchTerm(event.target.value)} //set search term
            placeholder={"Search " + searchCategory}
            onKeyPress={(event) => {
              //handle enter button press
              if (event.key === "Enter") {
                search();
              }
            }}
          />
          {results && searchCategory !== "Pet Owners" && (
            <ComboboxPopover className={styles["combobox-popover"]}>
              {results.length > 0 ? (
                <ComboboxList className={styles["combobox-list"]}>
                  {results.slice(0, 5).map((result) => {
                    const value = result.label;

                    prefilterObject.current[value] = result;
                    return (
                      <ComboboxOption key={result.label} value={result.label} />
                    );
                  })}
                </ComboboxList>
              ) : (
                <span style={{ display: "block", margin: 8 }}>
                  No Results Found
                </span>
              )}
            </ComboboxPopover>
          )}
        </Combobox>

        <Combobox
          className={styles["location-input-container"]}
          onSelect={async (address) => {
            setValue(address, false);
            clearSuggestions();
            try {
              const results = await getGeocode({ address });
              const { lat, lng } = await getLatLng(results[0]);
              setSearchLocationLat(lat);
              setSearchLocationLng(lng);
            } catch (error) {
              console.log("error!");
            }
          }}
        >
          {/* Input Box */}
          {searchCategory !== "Pet Owners" && (
            <ComboboxInput
              className={styles["location-input"]}
              value={value}
              placeholder={
                searchCategory !== "Pet Owners" && "Near Current Location"
              }
              onChange={(e) => {
                setValue(e.target.value);
                // setSearchTerm(e.target.value);
              }}
              disabled={!ready}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  search();
                }
              }}
            />
          )}
          {/* Dropdown List */}
          <ComboboxPopover className={styles["combobox-popover"]}>
            <ComboboxList className={styles["combobox-list"]}>
              {status === "OK" &&
                data.map(({ id, description }) => (
                  <ComboboxOption key={id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>

        {windowSize.width > 768 && (
          <button
            className={styles["searchbar-search-icon"]}
            onClick={search}
          />
        )}
        {windowSize.width <= 768 && windowSize.width > 450 && (
          <button className={styles["searchbar-search"]} onClick={search}>
            Search
          </button>
        )}
        {windowSize.width <= 450 && (
          <span className={styles["searchbar-multifunc"]}>
            <button
              className={styles["searchbar-multifunc-cancel"]}
              onClick={closeMobileSearchBar}
            >
              Cancel
            </button>
            <button
              className={styles["searchbar-multifunc-search"]}
              onClick={search}
            >
              Search
            </button>
          </span>
        )}
      </div>
    </>
  );
}

export default SearchBar;
