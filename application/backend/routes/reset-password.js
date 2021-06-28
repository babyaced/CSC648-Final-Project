const express = require("express");
const connection = require("../db");
const router = express.Router();
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");
const randomToken = require("random-token");

router.post("/", (req, res) => {
  //console.log("/resetpassword")

  const email = req.body.email;
  const token = randomToken(16);

  //console.log(email)
  if (req.body.email == "") {
    res.status(400).send("Email required");
  }

  connection.query(
    "SELECT * FROM User WHERE email = ?",
    [email],
    function (error, results, fields) {
      //console.log(results)
      if (results.length > 0 && email == results[0].email) {
        // Needs to be inserted into a "token" column in the user in the
        // database
        const resetPasswordToken = token;
        const passwordExpires = Date.now() + 140000000;
        connection.query(
          `UPDATE Credentials SET reset_token =?, reset_expiry = NOW() + INTERVAL 48 HOUR WHERE email= ?`,
          [resetPasswordToken, email],
          function (error, results, fields) {
            //console.log("Inserted Token and Expiry")
          }
        );
      } else {
        //console.log("No Email");
        res.status(400).json("no email exists");
      }
    }
  );

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "zoobleinc@gmail.com",
      pass: "Testtest9!",
    },
  });

  const mailOptions = {
    from: "mySqlDemoEmail@gmail.com",
    to: `${email}`,
    subject: `Link to Reset Zooble Password`,
    text:
      "You are recieving this email because you (or another party) have requested the reset of the password \n\n" +
      "associated with your account. Please click on the following link, or paste this into your browser to \n\n" +
      "complete the process: \n\n" +
      `zooble.link/reset/${token}\n\n` +
      "If you did not request the reset, please ignore this e-mail. \n",
  };

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.error("Error: ", err);
    } else {
      //console.log("Here is the response: ", response);
      res.status(200).json("recovery email sent");
    }
  });
});

router.post("/:token", (req, res) => {
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
