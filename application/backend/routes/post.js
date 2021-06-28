const express = require("express");
const router = express.Router();

const connection = require("../db");

router.post("/", (req, res) => {
  // uploading a post
  const { postBody, photoLink } = req.body;

  connection.getConnection(function (err, conn) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    conn.beginTransaction(async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      try {
        const [insertedPost, _] = await conn.promise().query(
          `INSERT INTO Post (body, reg_user_id, like_count, comment_count, flag_count) 
          VALUES 
          (?, ?, 
           0, 
           0, 0)`,
          [postBody, req.session.reg_user_id]
        );
        console.log("insertedPost: ", insertedPost);

        if (photoLink) {
          const [insertedPhoto, _] = await conn
            .promise()
            .query(`INSERT INTO Photo (link, post_id) VALUES (?,?)`, [
              photoLink,
              insertedPost.insertId,
            ]);
          console.log("insertedPhoto: ", insertedPhoto);
        }

        if (req.body.taggedPets) {
          for (let i = 0; i < req.body.taggedPets.length; i++) {
            const [insertedPet, _] = await conn
              .promise()
              .query(`INSERT INTO PostTag (post_id, pet_id) VALUES (?, ?)`, [
                insertedPost.insertId,
                req.body.taggedPets[i].value,
              ]);
            console.log("insertedPet: ", insertedPet);
          }
        }
        conn.commit(async function (err) {
          if (err) {
            return conn.rollback(function () {
              console.error(err);
              return res.status(500).json(err);
            });
          } else {
            console.log("insertedPost.insertId: ", insertedPost.insertId);
            console.log("req.session.reg_user_id: ", req.session.reg_user_id);
            const [insertedPostInfo, insertedPostInfoFields] = await conn
              .promise()
              .query(
                `SELECT Profile.display_name, Profile.profile_id, Profile.profile_pic_link, Post.timestamp, Photo.link
                FROM Post
                LEFT JOIN RegisteredUser ON Post.reg_user_id = RegisteredUser.reg_user_id
                LEFT JOIN Account ON Account.user_id = RegisteredUser.user_id
                LEFT JOIN Photo ON Photo.post_id = Post.post_id
                LEFT JOIN Profile ON Profile.account_id = Account.account_id
                WHERE Post.post_id = ?
                AND Post.reg_user_id = ?
                AND Profile.pet_id IS NULL`,
                [insertedPost.insertId, req.session.reg_user_id]
              );
            console.log("insertedPostInfo[0]: ", insertedPostInfo[0]);
            return res.status(200).json({
              post_id: insertedPost.insertId,
              body: postBody,
              display_name: insertedPostInfo[0].display_name,
              timestamp: insertedPostInfo[0].timestamp,
              link: insertedPostInfo[0].link,
              profile_pic_link: insertedPostInfo[0].profile_pic_link,
              profile_id: insertedPostInfo[0].profile_id,
            });
          }
        });
      } catch (err) {
        console.error(err);
        return conn.rollback(function () {
          console.error(err);
          return res.status(500).json(err);
        });
      }
    });
  });
});

router.put("/", (req, res) => {
  // edit a post

  //console.log("/edit-post");
  const postBody = req.body.body;
  // const userId = req.body.userId;
  const postID = req.body.postId;
  //const imageLink = req.body.imageLink;

  connection.query(
    `UPDATE Post SET body = ? WHERE post_id = ?`,
    [postBody, postID],
    (error, post) => {
      if (error) {
        console.error("An error occurred while executing the query");
        res.status(500).json(error);
      } else {
        //console.log("post body has been updated")
        // if (imageLink = null) { // If the request contain image url equal to null then we delete the image
        //     connection.query(`DELETE FROM Photo WHERE post_id = '${postID}'`, (error, photo, fields) => {
        //         if (error) {
        //             console.error('An error occurred while executing the query, DELETE FROM Photo');
        //             res.status(500).json(error);
        //         }
        //         //console.log("image has been deleted!")
        //     });
        // }

        res.status(200).json(post);
      }
    }
  );
});

router.post("/flag", (req, res) => {
  //console.log('POST /api/flag-unflag')
  const { postToFlag } = req.body;
  //console.log(postToFlag)
  //console.log(req.session.reg_user_id)

  connection.query(
    `INSERT INTO PostFlag (reg_user_id, post_id) VALUES (?, ?)`,
    [req.session.reg_user_id, postToFlag],
    function (err, result) {
      if (err) {
        //console.log(err)
        if (err.errno == 1062) {
          //console.log(1062);
          connection.query(
            `DELETE FROM PostFlag
                        WHERE (PostFlag.reg_user_id = ?
                        AND PostFlag.post_id = ?)`,
            [req.session.reg_user_id, postToFlag],
            function (err, deleteResult) {
              if (err) {
                //console.log(err);
              } else {
                //console.log('Unflagged the Post')
                //console.log(deleteResult);
                res.status(200).json("unflag");
              }
            }
          );
        }
      } else {
        //console.log('Successfully flagged the post')
        res.status(200).json("unflag");
        //console.log(result);
      }
    }
  );
});

module.exports = router;
