//Will contain all sign-up related routes
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const connection = require("../db");

router.post("/api/reset/:token", (req, res) => {
  //console.log("/reset");
  const givenEmail = req.body.email;
  const givenPassword = req.body.password;
  const givenResubmitted = req.body.redonePassword;

  //console.log(givenEmail)
  //console.log(givenPassword)
  //console.log(givenResubmitted)

  function passwordValidate(password) {
    var re = {
      capital: /[A-Z]/,
      digit: /[0-9]/,
      special: /[!@#$%^&*]/,
      full: /^[A-Za-z0-9!@$%^&*]{8,50}$/,
    };
    return (
      re.capital.test(givenPassword) &&
      re.digit.test(givenPassword) &&
      re.special.test(givenPassword) &&
      re.full.test(givenPassword)
    );
  }

  if (givenEmail.length > 0) {
    connection.query(
      `SELECT user_id FROM User WHERE email= ?`,
      [givenEmail],
      (error, post, fields) => {
        if (passwordValidate(givenPassword)) {
          //if password is valid
          if (givenPassword === givenResubmitted) {
            //if password and confirmed password match
            const hash = bcrypt.hashSync(givenPassword, 10);
            //console.log(hash)

            connection.query(
              `DELETE FROM token WHERE expires < NOW()`,
              function (err, insertedCredentials) {
                if (err) {
                  //console.log(err)
                }
                //console.log('Not deleted properly');
              }
            );

            connection.query(
              `UPDATE Credentials SET password = ? WHERE email= ?`,
              [hash, givenEmail],
              function (err, insertedCredentials) {
                if (err) {
                  res.status(500).json(err);
                }
                //console.log('URL expired');
              }
            );
          } else {
            //console.log("Passwords do not match.");
            res.status(400).json("passwords not matching");
          }
        } else {
          //console.log("Password must have SUCH AND SUCH values")
          res.status(400).json("password requirements");
        }
      }
    );
  }
});

module.exports = router;
