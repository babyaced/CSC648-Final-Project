//Import Libraries
import React from "react";
import { Link } from "react-router-dom";

//Import CSS
import styles from "./SearchResultCard.module.css";

function BusinessSearchResultCard({ searchResult, panTo, index }) {
  return (
    <li className={styles["search-result"]}>
      <img
        className={styles["search-result-pic"]}
        src={searchResult.profile_pic_link}
        alt={searchResult.display_name}
      />
      <Link
        className={styles["profile-link"]}
        to={"/Profile/" + searchResult.profile_id}
      >
        <div className={styles["search-result-name-address"]}>
          <div className={styles["search-result-name"]}>
            {searchResult.name}
          </div>
          <div className={styles["search-result-address"]}>
            {searchResult.address}
          </div>
        </div>
      </Link>
      <img
        className={styles["search-result-marker"]}
        src={`https://csc648groupproject.s3-us-west-2.amazonaws.com/marker${index + 1
          }.png`}
        onClick={() => {
          panTo({
            lat: parseFloat(searchResult.latitude),
            lng: parseFloat(searchResult.longitude),
          });
        }}
        alt={`marker ${index + 1}`}
      />
    </li>
  );
}

export default BusinessSearchResultCard;
