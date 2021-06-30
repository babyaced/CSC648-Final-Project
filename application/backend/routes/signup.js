//Will contain all sign-up related routes
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

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

router.post("/", (req, res) => {
  //console.log("/sign-up");
  const givenEmail = req.body.email;
  const givenUsername = req.body.uname;
  const givenFirstName = req.body.firstName;
  const givenLastName = req.body.lastName;
  const givenPassword = req.body.password;
  const givenResubmitted = req.body.redonePassword;
  const validateOnly = req.body.validateOnly;

  let errorFlag = false;

  let errorResponseObject = {
    emailTakenError: "",
    usernameTakenError: "",
    passwordRequirementsError: "",
    nonMatchingPasswordError: "",
  };

  connection.getConnection(function (err, conn) {
    if (err) {
      res.status(500).json(err);
    } else {
      conn.beginTransaction(async function (err) {
        if (err) {
          console.log(err);
          res.status(500).json(err);
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
              errorResponseObject.usernameTakenError =
                "Username Already in Use";
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

            if (errorFlag) {
              return res.status(400).json(errorResponseObject);
            }

            if (!errorFlag) {
              if (validateOnly) {
                return res.status(200).json("SUCCESS");
              }
              const hash = await bcrypt.hash(givenPassword, 10);
              console.log(hash);

              const insertedUser = await conn
                .promise()
                .query(
                  `INSERT INTO User (email,first_name, last_name) VALUES (?,?,?)`,
                  [givenEmail, givenFirstName, givenLastName]
                );
              console.log("insertedUser: ", insertedUser);
              const insertedAccount = await conn
                .promise()
                .query(
                  `INSERT INTO Account (user_id, role_id)  VALUES  (?,?)`,
                  [insertedUserID, 1]
                );
              console.log("insertedAccount: ", insertedAccount);

              const insertedCredentials = await conn
                .promise()
                .query(
                  `INSERT INTO Credentials (acct_id, username, password) VALUES (?,?,?)`,
                  [insertedAccountID, givenUsername, hash]
                );
              console.log("insertedCredentials: ", insertedCredentials);
              const updatedProfile = await conn
                .promise()
                .query(
                  `UPDATE Profile SET Profile.display_name = ? , Profile.type = ? WHERE  Profile.account_id = ?`,
                  [givenFirstName, "PetOwner", insertedAccountID]
                );
              console.log("updatedProfile: ", updatedProfile);
            }

            conn.commit(function (err) {
              if (err) {
                return conn.rollback(function () {
                  res.status(500).json(err);
                });
              }
              return res.status(201).json("SUCCESS");
            });
          } catch (err) {
            console.error(err);
            return conn.rollback(function () {
              res.status(500).json(err);
            });
          }
        }
      });
    }
  });
});

router.post("/business", (req, res) => {
  //regular sign up
  console.log("API /signup/business");
  const givenEmail = req.body.email;
  const givenUsername = req.body.uname;
  const givenFirstName = req.body.firstName;
  const givenLastName = req.body.lastName;
  const givenPassword = req.body.password;
  const givenResubmitted = req.body.redonePassword;
  const givenBusinessName = req.body.businessName;
  const givenPhoneNumber = req.body.phoneNumber;
  const givenAddress = req.body.address;
  const givenLatitude = req.body.latitude;
  const givenLongitude = req.body.longitude;
  const givenBusinessType = req.body.type;

  let errorFlag = false;

  let errorResponseObject = {
    emailTakenError: "",
    usernameTakenError: "",
    passwordRequirementsError: "",
    nonMatchingPasswordError: "",
  };

  connection.getConnection(function (err, conn) {
    if (err) {
      res.status(500).json(err);
    } else {
      conn.beginTransaction(async function (err) {
        if (err) {
          console.log(err);
          res.status(500).json(err);
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
              errorResponseObject.usernameTakenError =
                "Username Already in Use";
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

            if (errorFlag) {
              return res.status(400).json(errorResponseObject);
            }

            const insertedUser = await conn
              .promise()
              .query(
                `INSERT INTO User (email,first_name, last_name) VALUES (?,?,?)`,
                [givenEmail, givenFirstName, givenLastName]
              );
            console.log("insertedUser: ", insertedUser);
            const insertedAccount = await conn
              .promise()
              .query(`INSERT INTO Account (user_id, role_id)  VALUES  (?,?)`, [
                insertedUser[0].insertId,
                1,
              ]);
            console.log("insertedAccount: ", insertedAccount);

            const hash = await bcrypt.hash(givenPassword, 10);
            console.log(hash);

            const insertedCredentials = await conn
              .promise()
              .query(
                `INSERT INTO Credentials (acct_id, username, password) VALUES (?,?,?)`,
                [insertedAccount[0].insertId, givenUsername, hash]
              );
            console.log("insertedCredentials: ", insertedCredentials);

            const insertedRegisteredUser = await conn
              .promise()
              .query(
                `SELECT RegisteredUser.reg_user_id FROM RegisteredUser WHERE RegisteredUser.user_id = ?`,
                [insertedUser[0].insertId]
              );

            console.log(
              "insertedRegisteredUser ",
              insertedRegisteredUser[0][0].reg_user_id
            );

            const insertedAddress = await conn
              .promise()
              .query(
                `INSERT INTO Address (address, latitude, longitude, reg_user_id) VALUES (?, ?, ?,?)`,
                [
                  givenAddress,
                  givenLatitude,
                  givenLongitude,
                  insertedRegisteredUser[0][0].reg_user_id,
                ]
              );

            console.log("insertedAddress ", insertedAddress);
            const insertedBusiness = await conn
              .promise()
              .query(
                `INSERT INTO Business (name, phone_num, reg_user_id) VALUES (?, ?, ?)`,
                [
                  givenBusinessName,
                  givenPhoneNumber,
                  insertedRegisteredUser[0][0].reg_user_id,
                ]
              );

            console.log("insertedBusiness ", insertedBusiness);

            const insertedCommerce = await conn
              .promise()
              .query(
                `INSERT INTO Commerce (business_id, business_type_id) VALUES (?, ?)`,
                [insertedBusiness[0].insertId, givenBusinessType]
              );

            console.log("insertedCommerce", insertedCommerce);

            const updatedProfile = await conn
              .promise()
              .query(
                `UPDATE Profile SET Profile.display_name = ?, Profile.type = 'Business' WHERE  Profile.account_id = ?`,
                [givenBusinessName, insertedAccount[0].insertId]
              );

            console.log("updatedProfile", updatedProfile);

            conn.commit(function (err) {
              if (err) {
                return conn.rollback(function () {
                  res.status(500).json(err);
                });
              }
              return res.status(201).json("SUCCESS");
            });
          } catch (err) {
            console.error(err);
            return conn.rollback(function () {
              res.status(500).json(err);
            });
          }
        }
      });
    }
  });
});
router.post("/shelter", (req, res) => {
  //console.log("/sign-up/shelter");
  const givenEmail = req.body.email;
  const givenUsername = req.body.uname;
  const givenFirstName = req.body.firstName;
  const givenLastName = req.body.lastName;
  const givenPassword = req.body.password;
  const givenResubmitted = req.body.redonePassword;
  const givenBusinessName = req.body.businessName;
  const givenPhoneNumber = req.body.phoneNumber;
  const givenAddress = req.body.address;
  const givenLatitude = req.body.latitude;
  const givenLongitude = req.body.longitude;
  const givenPetTypes = req.body.petTypes;

  var userId;

  connection.getConnection(function (err, conn) {
    if (err) {
      res.status(500).json(err);
    } else {
      conn.beginTransaction(async function (err) {
        if (err) {
          console.log(err);
          res.status(500).json(err);
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
              errorResponseObject.usernameTakenError =
                "Username Already in Use";
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

            if (errorFlag) {
              return res.status(400).json(errorResponseObject);
            }
            const insertedUser = await conn
              .promise()
              .query(
                `INSERT INTO User (email,first_name, last_name) VALUES (?,?,?)`,
                [givenEmail, givenFirstName, givenLastName]
              );
            console.log("insertedUser: ", insertedUser);
            const insertedAccount = await conn
              .promise()
              .query(`INSERT INTO Account (user_id, role_id)  VALUES  (?,?)`, [
                insertedUser.insertId,
                1,
              ]);
            console.log("insertedAccount: ", insertedAccount);

            const insertedCredentials = await conn
              .promise()
              .query(
                `INSERT INTO Credentials (acct_id, username, password) VALUES (?,?,?)`,
                [insertedAccount.insertId, givenUsername, hash]
              );
            console.log("insertedCredentials: ", insertedCredentials);
            const insertedAddress = await conn
              .promise()
              .query(
                `INSERT INTO Address (address, latitude, longitude, reg_user_id) VALUES (?, ?, ?,(SELECT reg_user_id FROM RegisteredUser WHERE user_id= ?))`,
                [
                  givenAddress,
                  givenLatitude,
                  givenLongitude,
                  insertedUser.insertId,
                ]
              );
            const insertedBusiness = await conn
              .promise()
              .query(
                `INSERT INTO Business (name, phone_num, reg_user_id) VALUES (?, ?, (SELECT reg_user_id FROM RegisteredUser WHERE user_id= ?))`,
                [givenBusinessName, givenPhoneNumber, insertedUser.insertId]
              );

            const insertedShelter = await conn
              .promise()
              .query(`INSERT INTO Shelter (business_id) VALUES (?)`, [
                insertedBusiness.insertId,
              ]);

            for (let i = 0; i < givenPetTypes.length; i++) {
              const insertedShelterType = await conn
                .promise()
                .query(
                  `INSERT INTO ShelterTypes (shelter_id, type_id) VALUES (?, ?)`,
                  [insertedShelter.insertId, givenPetTypes[i].value]
                );
              console.log(insertedShelterType);
            }

            const updatedProfile = await conn
              .promise()
              .query(
                `UPDATE Profile SET Profile.display_name = ?, Profile.type = 'Shelter' WHERE  Profile.account_id = ?`,
                [givenBusinessName, insertedAccount.insertId]
              );

            conn.commit(function (err) {
              if (err) {
                return conn.rollback(function () {
                  res.status(500).json(err);
                });
              }
              return res.status(201).json("SUCCESS");
            });
          } catch (err) {
            console.error(err);
            return conn.rollback(function () {
              res.status(500).json(err);
            });
          }
        }
      });
    }
  });
});

module.exports = router;
