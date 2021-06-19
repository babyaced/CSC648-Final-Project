import { useEffect, useState } from "react";

import axios from "axios";

let localCache = [];

function useCatBreedOptions() {
  const [catBreedOptions, setCatBreedOptions] = useState([]);
  const [status, setStatus] = useState("unloaded");

  useEffect(() => {
    if (!localCache.length) {
      console.log("fetching CatBreed options from db");
      requestCatBreedOptions();
    } else {
      console.log("using CatBreed options from cache");
      setCatBreedOptions(localCache);
    }
  }, []);

  async function requestCatBreedOptions() {
    setStatus("loading");

    axios
      .get("/api/cat-breeds") //get pet CatBreeds from database
      .then((response) => {
        //console.log(response);
        localCache = response.data;
        setCatBreedOptions(localCache);
        setStatus("loaded");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return [catBreedOptions, status];
}

export default useCatBreedOptions;
