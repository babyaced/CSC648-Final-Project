import { useEffect, useState } from "react";

import axios from "axios";

let localCache = [];

function useSizeOptions() {
  const [sizeOptions, setSizeOptions] = useState([]);
  const [status, setStatus] = useState("unloaded");

  useEffect(() => {
    if (!localCache.length) {
      //console.log("fetching Size options from db");
      requestSizeOptions();
    } else {
      //console.log("using Size options from cache");
      setSizeOptions(localCache);
    }
  }, []);

  async function requestSizeOptions() {
    setStatus("loading");

    axios
      .get("/api/dropdowns/sizes") //get pet sizes from database
      .then((response) => {
        ////console.log(response);
        localCache = response.data;
        setSizeOptions(localCache);
        setStatus("loaded");
      })
      .catch((err) => {
        //console.log(err);
      });
  }
  return [sizeOptions, status];
}

export default useSizeOptions;
