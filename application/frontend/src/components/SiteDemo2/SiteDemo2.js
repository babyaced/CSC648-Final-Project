import { useHistory } from "react-router";

import styles from "./SiteDemo2.module.css";

function SiteDemo2() {
  const history = useHistory();

  function searchLocalBusinesses() {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        pathname: "/MapSearch",
        state: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          searchTerm: "",
          searchCategoryParam: "Businesses",
        },
      };
      history.push(location);
    });
  }

  return (
    <div className={styles["site-demo2-container"]}>
      <div className={styles["right-side-container"]}>
        <h1>
          Use our location search tool to find a pet-friendly small business
          near you
        </h1>
        <button
          className={styles["search-biz-button"]}
          onClick={searchLocalBusinesses}
        >
          Try the Tool
        </button>
      </div>
    </div>
  );
}

export default SiteDemo2;
