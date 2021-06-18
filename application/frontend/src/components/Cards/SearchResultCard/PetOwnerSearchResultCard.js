//Import Libraries
import React from "react";
import { Link } from "react-router-dom";

//Import CSS
import styles from "./SearchResultCard.module.css";

function PetOwnerSearchResultCard({ searchResult }) {
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
        <h3>{searchResult.display_name}</h3>
      </Link>
    </li>
  );
}

export default PetOwnerSearchResultCard;
