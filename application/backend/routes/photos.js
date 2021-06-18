const express = require("express");
const router = express.Router();
const connection = require("../db");

// router.get("/api/photos", (req,res) =>{
//     //console.log(req.query);
//     //console.log("GET /api/photos")
//     connection.query(
//         `SELECT Post.post_id,
//          FROM Photo
//          LEFT JOIN Post ON Photo.post_id = Post.post_id
//          JOIN RegisteredUser ON Post.reg_user_id = RegisteredUser.reg_user_id
//          JOIN Account ON RegisteredUser.user_id = Account.user_id
//          LEFT JOIN Profile ON Account.account_id = Profile.account_id
//          WHERE Profile.profile_id = '${req.query.profileID}'`,
//         function(err, photoPosts){
//             if(err){
//                //console.log(err);
//             }
//             else{
//                 //console.log("photoPosts: ", photoPosts);
//                 res.status(200).json(photoPosts);
//             }
//         }
//     )
// })

module.exports = router;
