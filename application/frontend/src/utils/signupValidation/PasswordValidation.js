import React from "react";

function PasswordValidation(password) {
  let passwordErr = "";

  if (!password) {
    passwordErr = "Please enter a Password";
  }

  return passwordErr;
}

export default PasswordValidation;
