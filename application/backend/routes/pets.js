const express = require("express");
const connection = require("../db");
const router = express.Router();

router.get("/current-user", (req, res) => {
  //console.log("GET /api/current-user-pets");

  //get all profiles that are owned by the current user, but only the profiles associated with pets and not the profile that is the profile the user is on already
  connection.query(
    `SELECT *
         FROM Profile
         WHERE 
         (Profile.account_id = (SELECT Account.account_id FROM Account JOIN Profile ON Profile.profile_id = ? WHERE Account.account_id = Profile.account_id)) AND (Profile.profile_id != ?) AND (Profile.pet_id IS NOT NULL)`,
    [req.session.profile_id, req.session.profile_id],
    function (err, userPets) {
      if (err) {
        //console.log(err);
      }
      //console.log("userPets: ",userPets);
      res.status(200).json(userPets);
    }
  );
});

router.get("/profile", (req, res) => {
  console.log("/api/pets");

  const { profileID } = req.query;

  //console.log(profileID)

  //get all profiles that are owned by the current user, but only the profiles associated with pets
  connection.query(
    `SELECT *
         FROM Profile
         WHERE 
         (Profile.account_id = (SELECT Account.account_id FROM Account JOIN Profile ON Profile.profile_id = ? WHERE Account.account_id = Profile.account_id)) AND (Profile.profile_id != ?)  AND (Profile.pet_id IS NOT NULL)`,
    [profileID, profileID],
    function (err, userPets) {
      if (err) {
        //console.log(err);
      }
      //  //console.log("userPets: ",userPets);
      res.status(200).json(userPets);
    }
  );
});

// router.post("/api/edit-pet",(req,res) =>{
//     const {petProfileID, newName, new} = req.body
//     //console.log("POST /api/edit-pet");

//     connection.query(
//         `UPDATE Pet
//          JOIN Profile ON Profile.profile_id = ${petProfileID}
//          SET Pet.name =`
//     )

// })

module.exports = router;
