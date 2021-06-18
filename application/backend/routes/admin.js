const express = require('express');
const router = express.Router();

const connection = require('../db');

router.get("/api/posts-admin",(req,res)=>{
    const {offset} = req.query
    // //console.log("/api/get-admin-feed-posts");
    let username = req.session.username;
    let postsWithLikes = []; //array for holding objects with posts and likes
    connection.query(
        `SELECT Profile.profile_id, Post.post_id, Post.timestamp, Post.body, Post.like_count, Profile.display_name, Profile.profile_pic_link, Profile.pet_id, Photo.link, Post.flag_count
         FROM Post
         LEFT JOIN Photo ON Post.post_id = Photo.post_id
         LEFT JOIN RegisteredUser ON RegisteredUser.reg_user_id = Post.reg_user_id
         LEFT JOIN User ON RegisteredUser.user_id = User.user_id
         LEFT JOIN Account ON User.user_id = Account.user_id
         LEFT JOIN Profile ON Account.account_id = Profile.account_id
         AND Profile.pet_id IS NULL
         ORDER BY Post.flag_count DESC
         LIMIT 10
         OFFSET ?
        `,[offset],
        function(err, posts){
            if(err){
                // //console.log(err);
                res.status(500).json(err);
            }
            else{
                res.status(200).json(posts);
            }
        }
    )
})

router.post("/api/delete-post",(req,res)=>{
    // //console.log("POST /api/delete-post");

    const {postID} = req.body


    if(req.session.role === 3){ //check if logged in user has admin privileges
        connection.query(
            `DELETE
            FROM Post
            WHERE Post.post_id = ?
            `,[postID],
            function(err, result){
                if(err){}
                    // //console.log(err);
                else{
                    res.status(200).json(result);
                }
            }
        )
    }
})

router.post("/api/ban-user",(req,res) =>{
    // //console.log("POST /api/ban-user");
    const {profileID} = req.body
    // //console.log(profileID)

    if(req.session.role === 4){ //check if logged in user has admin privileges
        connection.query(
            `DELETE User
             FROM User
             JOIN Account ON Account.user_id = User.user_id
             JOIN Profile ON Profile.account_id = Account.account_id
             WHERE Profile.profile_id = ?
            `, [profileID],
            function(err, result){
                if(err){
                    // //console.log(err);
                    res.status(500).json(err);
                }
                else{
                    // //console.log(result);
                    res.status(200).json(result);
                }
            }
        )
    }
})

module.exports = router