import React, { useContext, useState } from "react";
import Axios from "axios";
import styles from "./LoginPage.module.css";
import { Redirect, useHistory } from "react-router-dom";
import ForgotPassword from "../../components/Modals/ForgotPassword";
import ServerErrorMessage from "../../components/InfoMessages/ServerErrorMessage";

import { RedirectPathContext } from "../../context/redirect-path";
import ButtonLoader from "../../components/UI/Spinner/ButtonLoader";

import UsernameValidation from "../../utils/signupValidation/UsernameValidation";
import PasswordValidation from "../../utils/signupValidation/PasswordValidation";

function LoginPage({ appUser, updateLoginState }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //toggle forgot password modal
  const [forgotPasswordModalDisplay, setForgotPasswordModalDisplay] =
    useState(false);

  const [serverError, setServerError] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const redirectContext = useContext(RedirectPathContext);

  let history = useHistory();

  function validateForm() {
    let usernameErr = UsernameValidation(username);
    let passwordErr = PasswordValidation(password);

    setUsernameError(usernameErr);
    setPasswordError(passwordErr);

    if (usernameErr || passwordErr) {
      return false;
    }

    return true;
  }

  function loginHandler(event) {
    event.preventDefault();
    setAwaitingResponse(true);

    const valid = validateForm();
    if (!valid) {
      setAwaitingResponse(false);
      return;
    }
    Axios.post(
      "/api/login",
      {
        username: username,
        password: password,
      },
      { withCredentials: true }
    )
      .then((response) => {
        if (response.data) {
          updateLoginState(true, response.data);
          history.push(redirectContext.redirectPath);
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setServerError(true);
          setAwaitingResponse(false);
        }
        if (error.response.status === 400) {
          setAwaitingResponse(false);
          console.log(error.response.data);
          setPasswordError(error.response.data.passwordError);
          setUsernameError(error.response.data.usernameError);
        }
      });
  }

  if (appUser) {
    return <Redirect to={redirectContext.redirectPath} />;
  }

  return (
    <>
      <form
        className={`${styles["login-container"]} ${"small-container"}`}
        onSubmit={loginHandler}
      >
        <div className={styles["login-header"]}>
          <h1>Login</h1>
        </div>
        <div className={styles["username-input-container"]}>
          <label className={styles["username-input-label"]} for="username">
            Username
          </label>
          <input
            type="username"
            placeholder="Enter Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={!usernameError ? styles.valid : styles.invalid}
            disabled={awaitingResponse}
          />
          <span className={styles["termsError"]}>{usernameError}</span>
        </div>
        <div className={styles["password-input-container"]}>
          <label className={styles["password-input-label"]} for="password">
            Password
          </label>
          <button
            className={styles["forgot-password"]}
            onClick={() => setForgotPasswordModalDisplay(true)}
            disabled={awaitingResponse}
          >
            {" "}
            Forgot password?
          </button>
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={!passwordError ? styles.valid : styles.invalid}
            disabled={awaitingResponse}
          />
          <span className={styles["termsError"]}>{passwordError}</span>
        </div>

        <button
          type="submit"
          className={styles["submit-btn"]}
          disabled={awaitingResponse}
        >
          {awaitingResponse ? <ButtonLoader message={"Login"} /> : "Login"}
        </button>
        <div className={styles["checkbox"]}>
          <input type="checkbox" name="remember" disabled={awaitingResponse} />{" "}
          Remember Me
        </div>

        <div className={styles["create-account-link"]}>
          Not registered? <a href="/account-type">Create an account</a>
        </div>
        <ServerErrorMessage serverError={serverError} />
      </form>
      {/* Modals */}
      <ForgotPassword
        display={forgotPasswordModalDisplay}
        onClose={() => setForgotPasswordModalDisplay(false)}
      />
    </>
  );
}

export default LoginPage;
