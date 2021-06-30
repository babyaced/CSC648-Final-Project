import { useEffect, useState } from "react";

import axios from "axios";

let localCache = [];

function useBusinessCategoryOptions() {
  const [businessCategoryOptions, setBusinessCategoryOptions] = useState([]);
  const [status, setStatus] = useState("unloaded");

  useEffect(() => {
    if (!localCache.length) {
      ////console.log("fetching BusinessCategory options from db");
      requestBusinessCategoryOptions();
    } else {
      ////console.log("using BusinessCategory options from cache");
      setBusinessCategoryOptions(localCache);
    }
  }, []);

  async function requestBusinessCategoryOptions() {
    setStatus("loading");

    axios
      .get("/api/dropdowns/business-types") //get pet BusinessCategorys from database
      .then((response) => {
        //////console.log(response);
        localCache = response.data;
        setBusinessCategoryOptions(localCache);
        setStatus("loaded");
      })
      .catch((err) => {
        ////console.log(err);
      });
  }
  return [businessCategoryOptions, status];
}

export default useBusinessCategoryOptions;
