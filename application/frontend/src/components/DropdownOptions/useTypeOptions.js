import { useEffect, useState } from "react";

import axios from "axios";

let localCache = [];

function useTypeOptions() {
  const [typeOptions, setTypeOptions] = useState([]);
  const [status, setStatus] = useState("unloaded");

  useEffect(() => {
    if (!localCache.length) {
      console.log("fetching type options from db");
      requestTypeOptions();
    } else {
      console.log("using type options from cache");
      setTypeOptions(localCache);
    }
  }, []);

  async function requestTypeOptions() {
    setStatus("loading");

    axios
      .get("/api/pet-types") //get pet types from database
      .then((response) => {
        console.log(response);
        localCache = response.data;
        setTypeOptions(localCache);
        setStatus("loaded");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return [typeOptions, status];
}

export default useTypeOptions;
