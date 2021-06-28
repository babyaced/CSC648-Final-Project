const express = require("express");
const router = express.Router();

const connection = require("../db");

router.get("/", (req, res) => {
  // //console.log("/api/comments");
  // //console.log(req.query);

  // //console.log("Req.query.postId: ", req.query.post_id);

  connection.query(
    `SELECT PostComment.body, PostComment.comment_id, PostComment.like_count, PostComment.timestamp, Profile.profile_pic_link, Profile.display_name
        FROM PostComment
        LEFT JOIN RegisteredUser ON PostComment.reg_user_id = RegisteredUser.reg_user_id
        LEFT JOIN Account ON RegisteredUser.user_id = Account.user_id
        LEFT JOIN Profile ON Account.account_id = Profile.account_id
        WHERE PostComment.post_id = ?
        AND Profile.pet_id IS NULL`,
    [req.query.post_id],
    function (err, comments) {
      if (err) {
      }
      // //console.log(err);
      else {
        // //console.log("Comments: ", comments);
        res.status(200).json(comments);
      }
    }
  );
});

module.exports = router;
