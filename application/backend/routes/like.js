const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post("/api/like-unlike", (req,res) =>{
    const regUserId = req.session.reg_user_id;
    const postToLike = req.body.postToLike;

    connection.query(`INSERT INTO PostLike VALUES ('${regUserId}', '${postToLike}')`,
         function(err, result){
             if(err){
                if(err.errno = 1062){  //if duplicate key error means that the post has already been liked by the user
                    console.log(1062);
                    connection.query(
                        `DELETE FROM PostLike 
                         WHERE (PostLike.reg_user_id = '${regUserId}' 
                         AND PostLike.post_id = '${postToLike}')`,
                         function(err, result){
                             if(err){
                                 console.log(err);
                             }
                             else{
                                console.log(result);
                             }
                         }
                    )
                }
             }

             else{
                 res.status(200).json(result)
                 console.log(result);
             }
         }
    )
})

router.get("/api/likes", (req,res)=>{
    connection.query(
                 `SELECT COUNT(Like.reg_user_id)
                  FROM Like
                  WHERE Like.post_id = '${posts[i].post_id}'`,
                  function(err, likeCount){
                      if(err){
                          console.log(err);
                      }
                      else{
                          console.log(likeCount);
                      }
                  })
})

module.exports = router