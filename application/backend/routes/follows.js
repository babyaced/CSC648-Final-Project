const express = require("express");
const router = express.Router();

const connection = require("../db");

router.get("/followers", (req, res) => {
  let { profileID } = req.query;
  if (!profileID) {
    profileID = req.session.profile_id;
  }
  connection.query(
    `SELECT Profile.profile_pic_link, Profile.profile_id, Profile.display_name
         FROM Follow
         JOIN RegisteredUser ON RegisteredUser.reg_user_id = Follow.follower_id
         JOIN Account ON Account.user_id = RegisteredUser.user_id
         LEFT JOIN Profile ON Profile.account_id = Account.account_id
         WHERE Follow.reg_user_id = 
         (SELECT RegisteredUser.reg_user_id
            FROM RegisteredUser
            JOIN Account ON RegisteredUser.user_id = Account.user_id
            JOIN Profile ON Account.account_id = Profile.account_id
            WHERE Profile.profile_id = ?)
        `,
    [profileID],
    function (err, followers) {
      if (err) {
        //console.log(err);
      } else {
        //console.log(followers);
        res.status(200).json(followers);
      }
    }
  );
});

router.get("/following", (req, res) => {
  let { profileID } = req.query;
  if (!profileID) {
    profileID = req.session.profile_id;
  }
  //console.log("GET /api/following");
  connection.query(
    `SELECT Profile.profile_pic_link, Profile.profile_id, Profile.display_name
         FROM Follow
         JOIN RegisteredUser ON RegisteredUser.reg_user_id = Follow.reg_user_id
         JOIN Account ON Account.user_id = RegisteredUser.user_id
         LEFT JOIN Profile ON Profile.account_id = Account.account_id
         WHERE Follow.follower_id =
         (SELECT RegisteredUser.reg_user_id
          FROM RegisteredUser
          JOIN Account ON RegisteredUser.user_id = Account.user_id
          JOIN Profile ON Account.account_id = Profile.account_id
          WHERE Profile.profile_id = ?)
        `,
    [profileID],
    function (err, followings) {
      if (err) {
        //console.log(err);
      } else {
        //console.log(followings);
        res.status(200).json(followings);
      }
    }
  );
});

// router.get("/api/followers-following", (req,res) =>{
//     let
// })

module.exports = router;
