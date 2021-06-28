import { useState } from "react";
import Axios from "axios";
import styles from "./ResetPage.module.css";

import TermsAndConditions from "../../components/Modals/TermsAndConditions";
import PrivacyPolicy from "../../components/Modals/PrivacyPolicy";
import Input from "../../components/UI/Input/Input";
import { useHistory } from "react-router";

function ResetPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redonePassword, setRedonePassword] =
    useState(/*{
        inputConfig: {
            type: 'password',
            placeholder: 'Confirm password',
            name: 'psw-repeat'
        },
        value: '', 
        valid: false,
        touched: false
    }*/);

  //states for sign up error display
  const [error, setError] = useState(null);

  const errorDisplay = error ? (
    <div className={styles["signup-error-container"]}>{error}</div>
  ) : (
    <div className={styles["signup-requirements-container"]}>
      Your Password Must Have: 8-50 Characters and Contain: 1 Capital Letter, 1
      Number, 1 Special Character
    </div>
  );

  const history = useHistory();

  function reset(event) {
    event.preventDefault();

    // if(email && uname && firstName && lastName && password && redonePassword && acceptTerms){
    Axios.post(
      "/api/password-reset/:token",
      {
        email: email,
        password: password,
        redonePassword: redonePassword,
      },
      { withCredentials: true }
    )
      .then((response) => {
        if (response.data.affectedRows === 1) {
          //    history.push("/SignUpSuccess");
        }
      })
      .catch((error) => {
        if (error.response.data === "passwords not matching") {
          setError("The Passwords Entered Do Not Match");
        } else if (error.response.data === "password requirements") {
          setError(
            "Your Password Must Have: 8-50 Characters and Contain: 1 Capital Letter, 1 Number, 1 Special Character"
          );
        }
      });
    // }
  }

  return (
    <>
      <form className={styles["signup-container"]} onSubmit={reset}>
        <div className={styles["signup-container-header"]}>Reset Password</div>
        <div className={styles["signup-fields-container"]}>
          <div className={styles["email-input-container"]}>
            <label className={styles["email-input-label"]} for="psw">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter e-mail"
              name="eml"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles["password-input-container"]}>
            <label className={styles["password-input-label"]} for="psw">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              name="psw"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles["confirm-password-input-container"]}>
            <label
              className={styles["repeat-password-input-label"]}
              for="psw-repeat"
            >
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              name="psw-repeat"
              onChange={(e) => setRedonePassword(e.target.value)}
              required
            />
            {/* <Input
                            config={redonePassword.inputConfig}
                            value={redonePassword.value}
                            valid={redonePassword.valid}
                            touched={redonePassword.touched}
                            changed={event => onPasswordChangedHandler(event)}
                        /> */}
          </div>
        </div>

        <div className={styles["btn-container"]}>
          <button
            className={styles["submit-btn"]}
            type="submit"
            className={styles["submit-btn"]}
          >
            Reset Password
          </button>
          {/* <button disabled={!redonePassword.valid} type='submit' className={styles['submit-btn']} onClick={OnClickHandler}>Sign Up</button> */}
        </div>
        {errorDisplay}
      </form>
      {/* Modals */}
    </>
  );
}

export default ResetPage;
