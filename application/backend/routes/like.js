const express = require("express");
const router = express.Router();
const connection = require("../db");

router.post("/api/like-unlike", (req, res) => {
  //console.log("POST /api/like-unlike")
  const { postToLike } = req.body;

  connection.query(
    `INSERT INTO PostLike VALUES (?, ?)`,
    [req.session.reg_user_id, postToLike],
    function (err, result) {
      if (err) {
        if (err.errno == 1062) {
          //if duplicate key error means that the post has already been liked by the user
          //console.log(1062);
          connection.query(
            `DELETE FROM PostLike 
                         WHERE (PostLike.reg_user_id = ? 
                         AND PostLike.post_id = ?)`,
            [req.session.reg_user_id, postToLike],
            function (err, deleteResult) {
              if (err) {
                //console.log(err);
              } else {
                //console.log('Unliked the post')
                //console.log(deleteResult);
                res.status(200).json("unlike");
              }
            }
          );
        }
      } else {
        //console.log('Successfully liked the post')
        //console.log(result);
        res.status(200).json("like");
      }
    }
  );
});

router.get("/api/likes", (req, res) => {
  connection.query(
    `SELECT COUNT(PostLike.reg_user_id)
                  FROM PostLike
                  WHERE PostLike.post_id = ?`,
    [posts[i].post_id],
    function (err, likeCount) {
      if (err) {
        //console.log(err);
      } else {
        //console.log(likeCount);
      }
    }
  );
});

module.exports = router;
