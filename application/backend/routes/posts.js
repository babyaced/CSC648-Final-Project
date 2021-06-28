const express = require("express");
const router = express.Router();
const connection = require("../db");

router.get("/photos", (req, res) => {
  //console.log(req.query);
  //console.log("GET /api/photo-posts")
  connection.query(
    `SELECT *
         FROM Photo
         LEFT JOIN Post ON Photo.post_id = Post.post_id
         JOIN RegisteredUser ON Post.reg_user_id = RegisteredUser.reg_user_id
         JOIN Account ON RegisteredUser.user_id = Account.user_id
         JOIN Profile ON Account.account_id = Profile.account_id
         WHERE Profile.profile_id = ?`,
    [req.query.profileID],
    function (err, photoPosts) {
      if (err) {
        //console.log(err);
      } else {
        //console.log("photoPosts: ", photoPosts);
        res.status(200).json(photoPosts);
      }
    }
  );
});

router.get("/tagged", (req, res) => {
  console.log("GET /api/tagged-posts");

  connection.query(
    `SELECT * 
        FROM Photo
        LEFT JOIN Post ON Photo.post_id = Post.post_id
        JOIN RegisteredUser ON RegisteredUser.reg_user_id = Post.reg_user_id
        JOIN Account ON RegisteredUser.user_id = Account.user_id
        JOIN Profile ON Account.account_id = Profile.account_id
        WHERE Profile.profile_id = ${req.query.profileID}
        AND Photo.post_id 
        IN (SELECT PostTag.post_id
         FROM PostTag 
         WHERE PostTag.pet_id = Profile.pet_id)`,
    function (err, taggedPosts) {
      if (err) {
        console.log(err);
      } else {
        console.log("taggedPosts", taggedPosts);
        res.status(200).json(taggedPosts);
      }
    }
  );
});

module.exports = router;
