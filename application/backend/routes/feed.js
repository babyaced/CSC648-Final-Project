const express = require("express");
const connection = require("../db");
const router = express.Router();

router.get("/user", (req, res) => {
  //console.log("/api/get-feed-user");
  //console.log('req.session.profile_id: ', req.session.profile_id)

  connection.query(
    `SELECT Profile.display_name, Profile.profile_pic_link
         FROM Profile
         WHERE Profile.profile_id = ?`,
    [req.session.profile_id],
    function (err, feedUser) {
      if (err) {
        //console.log(err);
      } else {
        //console.log("FeedUser: ",feedUser);
        res.status(200).json(feedUser[0]);
      }
    }
  );
});

router.get("/", (req, res) => {
  const { offset } = req.query;
  //console.log(offset)
  console.log("GET /api/posts");
  let username = req.session.username;
  let postsWithLikes = []; //array for holding objects with posts and likes
  console.log("offset:", offset);
  connection.query(
    `SELECT Profile.profile_id, Profile.pet_id, Post.post_id, Post.timestamp, Post.body, Post.like_count, Profile.display_name, Profile.profile_pic_link, Profile.pet_id, Photo.link, Post.like_count
         FROM Post
         LEFT JOIN Photo ON Post.post_id = Photo.post_id
         LEFT JOIN RegisteredUser ON RegisteredUser.reg_user_id = Post.reg_user_id
         LEFT JOIN User ON RegisteredUser.user_id = User.user_id
         LEFT JOIN Account ON User.user_id = Account.user_id
         LEFT JOIN Profile ON Account.account_id = Profile.account_id
         WHERE Post.reg_user_id
         IN 
         (SELECT 
          Follow.reg_user_id
          FROM Follow
          WHERE Follow.follower_id = ?
          UNION
            SELECT RegisteredUser.reg_user_id
            FROM RegisteredUser
            WHERE RegisteredUser.reg_user_id = ?
          )
          AND Profile.pet_id IS NULL
          ORDER BY Post.timestamp DESC
          LIMIT 10
          OFFSET ${offset}
        `,
    [req.session.reg_user_id, req.session.reg_user_id],
    function (err, posts) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      } else {
        console.log(posts);
        res.status(200).json(posts);
      }
    }
  );
});

module.exports = router;
