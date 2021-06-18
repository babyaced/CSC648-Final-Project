import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./AccountType.module.css";

//Import Images
import OwnerImage from "../../assets/images/thirdparty/undraw_good_doggy_4wfq.svg";
import ShelterImage from "../../assets/images/thirdparty/undraw_pet_adoption_2qkw.svg";
import BusinessImage from "../../assets/images/thirdparty/undraw_business_shop_qw5t.svg";

function AccountTypePage() {
  return (
    <div className={`${styles["account-type-container"]} ${"wide-container"}`}>
      <div className={styles["owner-container"]}>
        <img className={styles["owner-img"]} src={OwnerImage} />
        <NavLink to="/signup-page/personal">
          <button className={styles["signup-button"]}>
            Sign Up as Pet Owner
          </button>
        </NavLink>
      </div>
      <div className={styles["shelter-container"]}>
        <img className={styles["shelter-img"]} src={ShelterImage} />
        <NavLink to="/signup-page/shelter">
          <button className={styles["shelter-button"]}>
            Sign Up as Pet Shelter
          </button>
        </NavLink>
      </div>
      <div className={styles["business-container"]}>
        <img className={styles["business-img"]} src={BusinessImage} />
        <NavLink to="/signup-page/business">
          <button className={styles["business-button"]}>
            Sign Up as Pet Business
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default AccountTypePage;
