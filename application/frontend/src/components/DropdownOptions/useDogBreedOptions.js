import { useEffect, useState } from "react";

import axios from "axios";

let localCache = [];

function useDogBreedOptions() {
  const [dogBreedOptions, setDogBreedOptions] = useState([]);
  const [status, setStatus] = useState("unloaded");

  useEffect(() => {
    if (!localCache.length) {
      //console.log("fetching DogBreed options from db");
      requestDogBreedOptions();
    } else {
      //console.log("using DogBreed options from cache");
      setDogBreedOptions(localCache);
    }
  }, []);

  async function requestDogBreedOptions() {
    setStatus("loading");

    axios
      .get("/api/dog-breeds") //get pet DogBreeds from database
      .then((response) => {
        ////console.log(response);
        localCache = response.data;
        setDogBreedOptions(localCache);
        setStatus("loaded");
      })
      .catch((err) => {
        //console.log(err);
      });
  }
  return [dogBreedOptions, status];
}

export default useDogBreedOptions;
