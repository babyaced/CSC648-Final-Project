const express = require("express");
const router = express.Router();

const connection = require("../db");

router.post("/api/upload-post", (req, res) => {
  // uploading a post
  //console.log("/api/upload-post");
  const postBody = req.body.postBody;
  //console.log("Post Body: ", postBody);
  const username = req.session.username; //username for currently logged in user on browser
  //console.log("Username: ", username);
  const photoLink = req.body.photoLink;
  //console.log("Photo Link: ", photoLink);

  connection.query(
    `INSERT INTO Post (body, reg_user_id, like_count, comment_count, flag_count) 
    VALUES 
    (?, ?, 
     0, 
     0, 0)`,
    [postBody, req.session.reg_user_id],
    (error, insertedPost) => {
      if (error) {
        console.error(error);
        res.status(500).json(error);
      } else {
        console.log(insertedPost);

        if (photoLink) {
          connection.query(
            `INSERT INTO Photo (link, post_id) VALUES (?,?)`,
            [photoLink, insertedPost.insertId],
            (error, photo) => {
              if (error) {
                console.error(error);
              }
              console.log("image was inserted!");
            }
          );
        } else {
          console.log("post was inserted (no image)!");
        }

        if (req.body.taggedPets) {
          for (let i = 0; i < req.body.taggedPets.length; i++) {
            connection.query(
              `INSERT INTO PostTag (post_id, pet_id) VALUES (?, ?)`,
              [insertedPost.insertId, req.body.taggedPets[i].value],
              function (err, insertedTag) {
                if (err) {
                  //console.log(err);
                } else {
                  console.log("InsertedTag: ", insertedTag);
                }
              }
            );
          }
        }
        res.status(200).json(insertedPost);
      }
    }
  );
});

module.exports = router;
