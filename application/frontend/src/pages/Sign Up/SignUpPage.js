import { useEffect, useState } from "react";
import Axios from "axios";
import styles from "./SignUpPage.module.css";

import TermsAndConditions from "../../components/Modals/TermsAndConditions";
import PrivacyPolicy from "../../components/Modals/PrivacyPolicy";
import Input from "../../components/UI/Input/Input";
import { useHistory } from "react-router";

//Import Validation Functions
import NameValidation from "../../utils/signupValidation/NameValidation";
import EmailValidation from "../../utils/signupValidation/EmailValidation";
import UsernameValidation from "../../utils/signupValidation/UsernameValidation";
import PasswordValidation from "../../utils/signupValidation/PasswordValidation";
import TermsValidation from "../../utils/signupValidation/TermsValidation";

import ButtonLoader from "../../components/UI/Spinner/ButtonLoader";

import ServerErrorMessage from "../../components/InfoMessages/ServerErrorMessage";

function SignUpPage({ type }) {
  ////console.log("type: ", type);
  //form states
  const [email, setEmail] = useState("");
  const [uname, setUname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [redonePassword, setRedonePassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  //form error states
  const [emailError, setEmailError] = useState("");
  const [unameError, setUnameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [redonePasswordError, setRedonePasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  //Password Requirement states
  // const [lengthRequirementStyle, setLengthRequirementStyle] = useState('unmet');
  // const [capitalRequirementStyle, setCapitalRequirementStyle] = useState('unmet');
  // const [numberRequirementStyle, setNumberRequirementStyle] = useState('unmet');
  // const [characterRequirementStyle, setCharacterRequirementStyle] = useState('unmet');

  const [termsAndConditionsDisplay, setTermsAndConditionsDisplay] =
    useState(false);
  const [privacyPolicyDisplay, setPrivacyPolicyDisplay] = useState(false);

  // const[passwordMatchStyle, setPasswordMatchStyle] = useState('same');

  const [passwordChecking, setPasswordChecking] = useState(false);

  const [signUpLoading, setSignUpLoading] = useState(false);

  const [serverError, setServerError] = useState(false);

  const history = useHistory();

  function signUp(event) {
    setSignUpLoading(true);
    event.preventDefault();

    const valid = validateForm();
    ////console.log("valid form: ", valid);
    if (!valid) {
      setSignUpLoading(false);
    } else if (valid) {
      let signUpObject = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        uname: uname,
        password: password,
        redonePassword: redonePassword,
        validateOnly: true,
      };
      //if signing up for personal account, go through with the sign up process now
      if (type === "personal") {
        signUpObject.validateOnly = false;
      }
      Axios.post("/api/signup", signUpObject, { withCredentials: true })
        .then((response) => {
          //console.log(response.data);
          if (response.status === 201) {
            history.push("/SignUpSuccess");
          } else if (response.status === 200) {
            let nextPage;
            type === "business"
              ? (nextPage = {
                  pathname: "/business-signup2",
                  state: {
                    email: email,
                    username: uname,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    redonePassword: redonePassword,
                  },
                  type: "business",
                })
              : (nextPage = {
                  pathname: "/shelter-signup2",
                  state: {
                    email: email,
                    username: uname,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    redonePassword: redonePassword,
                  },
                  type: "shelter",
                });
            history.push(nextPage);
          }
        })
        .catch((error) => {
          setSignUpLoading(false);
          console.error(error);
          if (error.response.status === 400) {
            setEmailError(error.response.data.emailTakenError);
            setUnameError(error.response.data.usernameTakenError);
            setPasswordError(error.response.data.passwordRequirementsError);
            setRedonePasswordError(
              error.response.data.nonMatchingPasswordError
            );
          }
          if (error.response.status === 500) {
            setServerError(true);
            setSignUpLoading(false);
          }
        });
    }
  }

  function validateForm() {
    let fNameErr = NameValidation(true, firstName);
    let lNameErr = NameValidation(false, lastName);
    let unameErr = UsernameValidation(uname);
    let emailErr = EmailValidation(email);
    let passwordErr = PasswordValidation(password);
    let rPasswordErr = PasswordValidation(redonePassword);
    let termsErr = TermsValidation(acceptTerms);

    setFirstNameError(fNameErr);
    setLastNameError(lNameErr);
    setEmailError(emailErr);
    setUnameError(unameErr);
    setPasswordError(passwordErr);
    setRedonePasswordError(rPasswordErr);
    setTermsError(termsErr);

    if (
      fNameErr ||
      lNameErr ||
      emailErr ||
      unameErr ||
      passwordErr ||
      rPasswordErr ||
      termsErr
    ) {
      return false;
    }

    ////console.log("no errors");
    return true;
  }

  //Config of password requirements display when password input field state changes
  let lengthRequirementStyle = "unmet";
  let capitalRequirementStyle = "unmet";
  let numberRequirementStyle = "unmet";
  let characterRequirementStyle = "unmet";
  if (password.length >= 8) {
    lengthRequirementStyle = "met";
  }
  if (password.toLowerCase() !== password) {
    capitalRequirementStyle = "met";
  }

  if (/[0-9]/.test(password)) {
    numberRequirementStyle = "met";
  }

  if (/[!()-.?\[\]_`~;:@#$%^&*+=]/.test(password)) {
    characterRequirementStyle = "met";
  }

  //Decide if password not matching message is displayed
  let passwordMatchStyle = "same";
  if (passwordChecking && password !== redonePassword) {
    ////console.log("Password Checking on");
    if (redonePassword.length === 0 || password.length == 0) {
      ////console.log("but password length is 0");
      passwordMatchStyle = "same";
      setPasswordChecking(false);
    } else {
      passwordMatchStyle = "differing";
    }
  }

  return (
    <>
      <form
        className={`${styles["signup-container"]} ${"small-container"}`}
        onSubmit={(e) => signUp(e)}
      >
        <div className={styles["signup-header"]}>
          <h1>Sign Up</h1>
        </div>
        <div className={styles["signup-fields-container"]}>
          <div className={styles["fname-input-container"]}>
            <label className={styles["fname-input-label"]} for="fname">
              First Name
            </label>
            <input
              type="text"
              placeholder="First name"
              name="fname"
              onChange={(e) => setFirstName(e.target.value)}
              // pattern="[A-Za-z]"
              maxlength="40"
              className={!firstNameError ? styles.valid : styles.invalid}
              disabled={signUpLoading}
            />
            <span className={styles["termsError"]}>{firstNameError}</span>
          </div>

          <div className={styles["lname-input-container"]}>
            <label className={styles["lname-input-label"]} for="lname">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last name"
              name="lname"
              onChange={(e) => setLastName(e.target.value)}
              // pattern="[a-zA-Z]"
              maxlength="40"
              className={!lastNameError ? styles.valid : styles.invalid}
              disabled={signUpLoading}
            />
            <span className={styles["termsError"]}>{lastNameError}</span>
          </div>

          <div className={styles["email-input-container"]}>
            <label className={styles["email-input-label"]} for="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              maxlength="320"
              className={!emailError ? styles.valid : styles.invalid}
              disabled={signUpLoading}
            />
            <span className={styles["termsError"]}>{emailError}</span>
          </div>

          <div className={styles["username-input-container"]}>
            <label className={styles["username-input-label"]} for="uname">
              Username
            </label>
            <input
              type="username"
              placeholder="Enter username"
              name="uname"
              onChange={(e) => setUname(e.target.value)}
              className={!unameError ? styles.valid : styles.invalid}
              disabled={signUpLoading}
            />
            <span className={styles["termsError"]}>{unameError}</span>
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
              className={!passwordError ? styles.valid : styles.invalid}
              disabled={signUpLoading}
            />
            <span className={styles["termsError"]}>{passwordError}</span>
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
              onBlur={() => setPasswordChecking(true)}
              className={!redonePasswordError ? styles.valid : styles.invalid}
              disabled={signUpLoading}
            />
            <span className={styles["termsError"]}>{redonePasswordError}</span>
          </div>
          <ul className={styles["password-requirements-list"]}>
            <li className={styles[lengthRequirementStyle]}>
              At least 8 characters
            </li>
            <li className={styles[capitalRequirementStyle]}>
              Contains a capital letter
            </li>
            <li className={styles[numberRequirementStyle]}>
              Contains a number
            </li>
            <li className={styles[characterRequirementStyle]}>
              Contains a special character
            </li>
          </ul>
          {passwordMatchStyle && (
            <span className={styles[passwordMatchStyle]}></span>
          )}
          <div className={styles["checkbox-container"]}>
            <span>By creating an account you agree to our:</span>
            <span>
              <span
                className={styles["terms-button"]}
                onClick={() => setTermsAndConditionsDisplay(true)}
              >
                {" "}
                Terms{" "}
              </span>
              &
              <span
                className={styles["policy-button"]}
                onClick={() => setPrivacyPolicyDisplay(true)}
              >
                {" "}
                Privacy Policy{" "}
              </span>
              <input
                type="checkbox"
                name="remember"
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={signUpLoading}
              />
            </span>
            <span className={styles["termsError"]}>{termsError}</span>
          </div>
        </div>
        {type === "personal" && (
          <button className={styles["submit-btn"]} type="submit">
            {signUpLoading ? <ButtonLoader message={"Sign Up"} /> : "Sign Up"}
          </button>
        )}
        {type === "business" && (
          <button
            className={styles["next-btn"]}
            type="submit"
            disabled={signUpLoading}
          >
            {signUpLoading ? (
              <ButtonLoader message={"Next: Business Info"} />
            ) : (
              "Next: Business Info"
            )}
          </button>
        )}
        {type === "shelter" && (
          <button
            className={styles["next-btn"]}
            type="submit"
            disabled={signUpLoading}
          >
            {signUpLoading ? (
              <ButtonLoader message={"Next: Shelter Info"} />
            ) : (
              "Next: Shelter Info"
            )}
          </button>
        )}
        <ServerErrorMessage serverError={serverError} />
      </form>
      {/* Modals */}
      {type === "personal" && (
        <>
          <TermsAndConditions
            display={termsAndConditionsDisplay}
            onClose={() => setTermsAndConditionsDisplay(false)}
          />
          <PrivacyPolicy
            display={privacyPolicyDisplay}
            onClose={() => setPrivacyPolicyDisplay(false)}
          />
        </>
      )}
    </>
  );
}

export default SignUpPage;
