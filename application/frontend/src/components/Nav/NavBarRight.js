//Import Libraries
import axios from "axios";
import { useRef, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";

//Import Icons
import DropdownArrow from "../../assets/icons/created/Arrow.svg";
import Messages from "../../assets/icons/created/Messages.svg";
import Account from "../../assets/icons/created/Account.svg";
import Menu from "../../assets/icons/created/Menu.svg";
import SearchMobile from "../../assets/icons/created/SearchMobile.svg";

//Import UI Components
import useWindowSize from "../Hooks/useWindowSize";

//Import CSS
import styles from "./NavBarRight.module.css";

//used to detect if there was a click outside the account menu to close it
import UseClickOutside from "../../utils/UseClickOutside.js";

function NavBarRight({
  appUser,
  updateLoginState,
  displayMobileSearchBar,
  closeMobileSearchBar,
}) {
  const history = useHistory();

  const [accountMenuDisplay, setAccountMenuDisplay] = useState({
    display: "none",
  });
  const windowSize = useWindowSize();
  function logoutHandler() {
    axios
      .post("/api/logout", { withCredentials: true })
      .then((response) => {
        updateLoginState(response.data.loggedIn, response.data.user);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  let domNode = UseClickOutside(() => {
    setMenuDisplay(false);
  });

  let hamburgerMenu = false;
  if (windowSize.width < 1170) {
    hamburgerMenu = true;
  }

  if (windowSize.width > 450) {
    console.log("closing mobile search bar");
    closeMobileSearchBar();
  }

  const [menuDisplay, setMenuDisplay] = useState(false);
  let menuClassname;
  menuDisplay ? (menuClassname = "menuVisible") : (menuClassname = "");

  return (
    <>
      {!appUser && (
        <span className={styles["navbar-right-login"]}>
          {windowSize.width <= 450 && (
            <img
              className={styles["search-icon"]}
              src={SearchMobile}
              onClick={displayMobileSearchBar}
            />
          )}
          <button
            className={styles["login-button"]}
            onClick={() => history.push("/login-page")}
          >
            Login
          </button>
        </span>
      )}
      {appUser && (
        <span className={styles["navbar-right"]}>
          {windowSize.width <= 450 && (
            <img
              className={styles["search-icon"]}
              src={SearchMobile}
              onClick={displayMobileSearchBar}
            />
          )}
          {windowSize.width <= 1470 && (
            <NavLink to="/Messages" className={styles["messages-menu-icon"]}>
              <img src={Messages} />
            </NavLink>
          )}
          {windowSize.width > 1470 && (
            <NavLink to="/Messages" className={styles["messages-menu"]}>
              Messages
            </NavLink>
          )}
          <span ref={domNode} className="account-menu-dropdown">
            {windowSize.width <= 1470 && (
              <img
                className={styles["account-menu-icon"]}
                src={Account}
                onClick={() => setMenuDisplay(!menuDisplay)}
              />
            )}
            {windowSize.width > 1470 && (
              <button
                className={styles["account-menu-dropdown-button"]}
                onClick={() => setMenuDisplay(!menuDisplay)}
              >
                Account
                <img
                  className={styles["account-menu-dropdown-arrow"]}
                  src={DropdownArrow}
                />
              </button>
            )}
            <ul
              className={`${styles["account-menu-dropdown"]} ${styles[menuClassname]}`}
            >
              <li>
                <NavLink
                  className={styles["account-menu-dropdown-link"]}
                  to={`/Profile/${appUser.profileID}`}
                >
                  My Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={styles["account-menu-dropdown-link"]}
                  to="/MyPets"
                >
                  My Pets
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={styles["account-menu-dropdown-link"]}
                  to="/"
                  onClick={logoutHandler}
                >
                  Logout
                </NavLink>
              </li>
            </ul>
          </span>
        </span>
      )}
    </>
  );
}

export default NavBarRight;
