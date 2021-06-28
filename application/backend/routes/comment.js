const express = require("express");
const router = express.Router();

const connection = require("../db");

router.post("/", (req, res) => {
  // comment on a post
  console.log("POST /api/comment");

  // //console.log("/comment");
  const { body, postId } = req.body;

  async function insertAndGetComment() {
    try {
      const [insertedComment, insertedCommentFields] = await connection
        .promise()
        .query(
          `INSERT INTO PostComment (body, reg_user_id, timestamp, like_count, post_id) VALUES (?,?,NOW(),?,?)`,
          [body, req.session.reg_user_id, 0, postId]
        );

      const [insertedCommentInfo, insertedCommentInfoFields] = await connection
        .promise()
        .query(
          `SELECT PostComment.body, PostComment.comment_id, PostComment.like_count, PostComment.timestamp, Profile.profile_pic_link, Profile.display_name
          FROM PostComment
          LEFT JOIN RegisteredUser ON PostComment.reg_user_id = RegisteredUser.reg_user_id
          LEFT JOIN Account ON RegisteredUser.user_id = Account.user_id
          LEFT JOIN Profile ON Account.account_id = Profile.account_id
          WHERE PostComment.comment_id = ?
          AND RegisteredUser.user_id = ?
          AND Profile.pet_id IS NULL`,
          [insertedComment.insertId, req.session.reg_user_id]
        );

      return res.status(200).json({
        comment_id: insertedComment.insertId,
        body: body,
        display_name: insertedCommentInfo[0].display_name,
        profile_pic_link: insertedCommentInfo[0].profile_pic_link,
        timestamp: insertedCommentInfo[0].timestamp,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  insertAndGetComment();
});

module.exports = router;
