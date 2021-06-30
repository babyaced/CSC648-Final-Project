import React from "react";
import { NavLink } from "react-router-dom";

import LogoScript from "../../assets/logos/created/Zoou_Logo_Horizontal_White_Text.svg";
import Logo from "../../assets/logos/created/Zoou_Icon.png";

import styles from "./NavBarLeft.module.css";

import useWindowSize from "../Hooks/useWindowSize";

function NavBarLeft({ appUser }) {
  const windowSize = useWindowSize();

  // ////console.log('windowSize: ',windowSize);

  return (
    <span className={styles["navbar-left"]}>
      {!appUser && (
        <NavLink to="/" activeClassName={styles["current"]}>
          {windowSize.width > 1470 ? (
            <img className={styles["logo-img-script"]} src={LogoScript} />
          ) : (
            <img className={styles["logo-img"]} src={Logo} />
          )}
        </NavLink>
      )}
      {appUser && (
        <NavLink to="/Feed" activeClassName={styles["current"]}>
          {windowSize.width > 1470 ? (
            <img className={styles["logo-img-script"]} src={LogoScript} />
          ) : (
            <img className={styles["logo-img"]} src={Logo} />
          )}
        </NavLink>
      )}
    </span>
  );
}

export default NavBarLeft;
