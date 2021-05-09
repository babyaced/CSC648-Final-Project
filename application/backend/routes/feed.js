const express = require('express');
const connection = require('../db');
const router = express.Router();

router.get("/api/feed-user",(req,res)=>{
    console.log("/api/get-feed-user");
    console.log('req.session.profile_id: ', req.session.profile_id)

    connection.query(
        `SELECT Profile.display_name, Profile.profile_pic_link
         FROM Profile
         WHERE Profile.profile_id = ?`, [req.session.profile_id], 
        function(err, feedUser){
            if(err){
                console.log(err);
            }
            else{
                console.log("FeedUser: ",feedUser);
                res.status(200).json(feedUser[0]);
            }
        }
    )
})

router.get("/api/get-feed-posts",(req,res)=>{
    console.log("/api/get-feed-posts");
    let username = req.session.username;
    connection.query(
        `SELECT Post.post_id, Post.timestamp, Post.like_count, Post.body, Profile.display_name, Profile.profile_pic_link, Profile.pet_id, Photo.link
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
          WHERE Follow.follower_id = '${req.session.reg_user_id}'
          UNION
            SELECT RegisteredUser.reg_user_id
            FROM RegisteredUser
            WHERE RegisteredUser.reg_user_id = '${req.session.reg_user_id}'
          )
          AND Profile.pet_id IS NULL
          ORDER BY Post.timestamp DESC
        `,
        function(err, posts){
            if(err)
                console.log(err);
            else{
                //get amount of likes for each post and append to post object
                // for(let i = 0; i < posts.length; i++){
                //     connection.query(
                //         `SELECT COUNT(Like.reg_user_id)
                //          FROM Like
                //          WHERE Like.post_id = '${posts[i].post_id}'`,
                //          function(err, likeCount){
                //              if(err){
                //                  console.log(err);
                //              }
                //              else{
                //                  console.log(likeCount);
                //              }
                //          })
                // }
                console.log("Posts: ", posts);
                res.status(200).json(posts);
            }
        }
    )
})

module.exports = router