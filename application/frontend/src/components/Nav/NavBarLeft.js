import React from "react";
import { NavLink } from "react-router-dom";

import LogoScript from '../../images/Created Icons/Zooble_Logo_Horizontal_White_Text.svg';

import styles from './NavBarLeft.module.css'

function NavBarLeft({appUser}) {
  return (
    <span  className={styles["navbar-left"]}>
      {!appUser && <NavLink to="/" activeClassName={styles["current"]}>
        <img className={styles["logo-img"]} src={LogoScript}/>
      </NavLink>
      }
      {appUser && <NavLink to="/Feed" activeClassName={styles["current"]}>
        <img className={styles["logo-img"]} src={LogoScript}/>
      </NavLink>
      }
    </span>
  );
}

export default NavBarLeft;