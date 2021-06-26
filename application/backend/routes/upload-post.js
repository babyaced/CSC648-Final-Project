const express = require("express");
const router = express.Router();

const connection = require("../db");

router.post("/api/upload-post", (req, res) => {
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
        const [insertedPost, _] = await connection.promise().query(
          `INSERT INTO Post (body, reg_user_id, like_count, comment_count, flag_count) 
          VALUES 
          (?, ?, 
           0, 
           0, 0)`,
          [postBody, req.session.reg_user_id]
        );
        console.log("insertedPost: ", insertedPost);

        if (photoLink) {
          const [insertedPhoto, _] = await connection
            .promise()
            .query(`INSERT INTO Photo (link, post_id) VALUES (?,?)`, [
              photoLink,
              insertedPost.insertId,
            ]);
          console.log("insertedPhoto: ", insertedPhoto);
        }

        if (req.body.taggedPets) {
          for (let i = 0; i < req.body.taggedPets.length; i++) {
            const [insertedPet, _] = await connection
              .promise()
              .query(`INSERT INTO PostTag (post_id, pet_id) VALUES (?, ?)`, [
                insertedPost.insertId,
                req.body.taggedPets[i].value,
              ]);
            console.log("insertedPet: ", insertedPet);
          }
        }
        return res.status(200).json({
          // petType: type,
          // petAge: age,
          // petSize: size,
          // petColors: colorSelectOptions,
          // dogBreeds: dogBreedSelectOptions,
          // catBreeds: catBreedSelectOptions,
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

module.exports = router;
