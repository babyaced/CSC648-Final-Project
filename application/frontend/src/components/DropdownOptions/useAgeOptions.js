import { useEffect, useState } from "react";
import axios from "axios";

let localCache = [];

function useAgeOptions() {
  const [ageOptions, setAgeOptions] = useState([]);
  const [status, setStatus] = useState("unloaded");

  useEffect(() => {
    if (!localCache.length) {
      console.log("fetching Age options from db");
      requestAgeOptions();
    } else {
      console.log("using Age options from cache");
      setAgeOptions(localCache);
    }
  }, []);

  async function requestAgeOptions() {
    setStatus("loading");

    axios
      .get("/api/ages") //get pet types from database
      .then((response) => {
        // console.log(response);
        localCache = response.data;
        setAgeOptions(localCache);
        setStatus("loaded");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return [ageOptions, status];
}

export default useAgeOptions;
