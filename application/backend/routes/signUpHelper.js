const connection = require("../db");

function passwordValidate(password) {
  var re = {
    capital: /[A-Z]/,
    digit: /[0-9]/,
    special: /[!@#$%^&*]/,
    full: /^[A-Za-z0-9!@$%^&*]{8,}$/,
  };
  return (
    re.capital.test(password) &&
    re.digit.test(password) &&
    re.special.test(password) &&
    re.full.test(password)
  );
}

async function validateSignUp(givenEmail, givenUsername, givenPassword) {
  let errorFlag = false;

  let errorResponseObject = {
    emailTakenError: "",
    usernameTakenError: "",
    passwordRequirementsError: "",
    nonMatchingPasswordError: "",
  };

  connection.getConnection(async function (err, conn) {
    if (err) {
      return err;
    } else {
      try {
        const email = await conn
          .promise()
          .query("SELECT user_id FROM User WHERE email=?", [givenEmail]);
        console.log("email: ", email);

        if (email[0].length > 0) {
          errorFlag = true;
          errorResponseObject.emailTakenError = "Email Already in Use";
        }

        const username = await conn
          .promise()
          .query("SELECT username FROM Credentials WHERE username=?", [
            givenUsername,
          ]);
        console.log("username: ", username);

        if (username[0].length > 0) {
          errorFlag = true;
          errorResponseObject.usernameTakenError = "Username Already in Use";
        }

        if (!passwordValidate(givenPassword)) {
          errorFlag = true;
          errorResponseObject.passwordRequirementsError =
            "Password does not meet requirements";
        }
        if (givenPassword !== givenResubmitted) {
          errorFlag = true;
          errorResponseObject.nonMatchingPasswordError =
            "Passwords Not Matching";
        }
        console.log("errorResponseObject: ", errorResponseObject);
        return errorResponseObject;
      } catch (err) {
        console.trace("Error", err);
        return err;
      }
    }
  });
}

module.exports = validateSignUp;
