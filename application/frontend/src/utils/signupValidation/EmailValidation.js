import React from "react";

function EmailValidation(email) {
  let emailErr = "";
  //console.log("email: ", email);

  if (!email) {
    emailErr = "Please enter an Email";
  } else if (!email.includes("@")) {
    emailErr = "Invalid Email";
  }

  return emailErr;
}

export default EmailValidation;
