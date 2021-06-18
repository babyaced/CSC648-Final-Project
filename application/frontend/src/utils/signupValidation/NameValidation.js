import React from "react";

function NameValidation(firstName, name) {
  let nameErr = "";

  if (!name) {
    if (firstName) nameErr = "Please enter your first name";
    else {
      nameErr = "Please enter your last name";
    }
  }

  return nameErr;
}

export default NameValidation;
