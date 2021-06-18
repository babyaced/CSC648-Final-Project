import React from "react";
import { useHistory } from "react-router";

import CheckMark from "../../assets/images/thirdparty/undraw_checkbox.svg";

import styles from "./SignUpSuccess.module.css";

function SignUpSuccess() {
  const history = useHistory();

  function OnClickHandler() {
    history.push("/login-page");
  }

  return (
    <div
      className={`${styles["signup-success-container"]} ${"small-container"}`}
    >
      <img
        className={styles["signup-container-check"]}
        src={CheckMark}
        alt="Sign Up Check Mark"
      />
      <h3>Your Account was Successfully Created! You can now Login</h3>
      <button
        type="submit"
        className={styles["submit-btn-2"]}
        onClick={OnClickHandler}
      >
        Login
      </button>
    </div>
  );
}

export default SignUpSuccess;
