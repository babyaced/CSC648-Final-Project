import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./HeroContainer.module.css";

//Import components
import CallToActionButton from "../Buttons/CallToActionButton";

//Import Images
import DogOwnerImage from "../../assets/images/thirdparty/undraw_Modern_woman_lxh7.svg";
import CatOwnerImage from "../../assets/images/thirdparty/undraw_chilling_8tii 1.svg";

function HeroContainer() {
  const history = useHistory();

  function searchLocalPets() {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        pathname: "/MapSearch",
        state: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          searchTerm: "",
          searchCategoryParam: "Pets",
        },
      };
      history.push(location);
    });
  }

  function goToSignUp() {
    history.push("/account-type");
  }

  return (
    <div className={styles["hero-container"]}>
      <div className={styles["left-side-container"]}>
        <h1>The Social Network for your furry (or not so furry) friends</h1>
        <h2>Sign Up or Search for a Friend to Get Started</h2>
        <div className={styles["button-container"]}>
          <button className={styles["signup-button"]} onClick={goToSignUp}>
            Sign Up
          </button>
          <button
            className={styles["find-friend-button"]}
            onClick={searchLocalPets}
          >
            Find a Friend
          </button>
        </div>
      </div>

      <div className={styles["right-side-container"]}>
        <img className={styles["right-side-image"]} src={DogOwnerImage} />
      </div>
    </div>
  );
}

export default HeroContainer;
