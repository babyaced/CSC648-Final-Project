const express = require('express');
const router = express.Router();

const connection = require('../db');

router.post("/api/edit-post", (req, res) => { // edit a post

    //console.log("/edit-post");
    const postBody = req.body.body;
    // const userId = req.body.userId;
    const postID = req.body.postId;
    //const imageLink = req.body.imageLink;

    connection.query(`UPDATE Post SET body = '${postBody}' WHERE post_id = '${postID}'`, (error, post, fields) => {
        if (error) {
            console.error('An error occurred while executing the query');
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
    });
});

module.exports = router