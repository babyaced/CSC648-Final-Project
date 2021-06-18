const express = require('express');
const router = express.Router();

const connection = require('../db');

router.post("/api/follow-unfollow-user", (req, res) => { // follow user
    //console.log("POST /api/follow-unfollow-user");
    const {accountId} = req.body

    connection.query(
        `INSERT INTO Follow (follower_id, reg_user_id) 
         VALUES (?,
                (SELECT RegisteredUser.reg_user_id 
                 FROM RegisteredUser
                 JOIN Account ON Account.user_id = RegisteredUser.user_id
                 WHERE Account.account_id = ?
                 ))`, [req.session.reg_user_id,accountId],
        function(err, follow){  //anytime we use the currently logged in user's information we use the id stored in session
            if (err) {
                console.error(err);
                    if(err.errno = 1062){  //if duplicate key error means that the post has already been liked by the user
                        //console.log(1062);
                        connection.query(
                            `DELETE FROM Follow 
                            WHERE Follow.reg_user_id = ? 
                            AND Follow.follower_id = (SELECT RegisteredUser.reg_user_id 
                                FROM RegisteredUser
                                JOIN Account ON Account.user_id = RegisteredUser.user_id
                                WHERE Account.account_id = ?
                                )`,[accountId, req.session.reg_user_id],
                            function(err, result){
                                if(err){
                                    //console.log(err);
                                }
                                else{
                                    //console.log("Follower has been deleted")
                                    //console.log(result);
                                    res.status(200).json(result);
                                    res.end;
                                }
                            }
                        )
                    }
            }
            else {
                //console.log("Follower has been added");
                //We don't have followers_count in Profile database entity but I think we should,
                // then it would be updated in this section.
                res.status(200).json(follow);
                res.end;
            }
    });
});

// router.post("/api/unfollow-user", (req, res) => { // follow user

//     //console.log("/unfollow-user");
//     const followerId = req.body.followerId;
//     const userId = req.body.userId;

//     connection.query(`DELETE FROM Follow WHERE reg_user_id = '${userId}' AND follower_id = '${followerId}'`, (error, unfollow, fields) => {
//         if (error) {
//             console.error('An error occurred while executing the query');
//             res.status(500).json(error);
//         } else {
//             //console.log("unfollowed");
//             //We don't have followers_count in Profile database entity but I think we should,
//             // then it would be updated in this section.
//             res.sendStatus(200);
//         }
//     });
// });

router.get("/api/followers", (req,res) =>{
    let {profileID} = req.query;
    if(!profileID){
        profileID = req.session.profile_id;
    }
    connection.query(
        `SELECT Profile.profile_pic_link, Profile.profile_id, Profile.display_name
         FROM Follow
         JOIN RegisteredUser ON RegisteredUser.reg_user_id = Follow.follower_id
         JOIN Account ON Account.user_id = RegisteredUser.user_id
         LEFT JOIN Profile ON Profile.account_id = Account.account_id
         WHERE Follow.reg_user_id = 
         (SELECT RegisteredUser.reg_user_id
            FROM RegisteredUser
            JOIN Account ON RegisteredUser.user_id = Account.user_id
            JOIN Profile ON Account.account_id = Profile.account_id
            WHERE Profile.profile_id = ?)
        `, [profileID],
        function(err, followers){
            if(err){
                //console.log(err);
            }
            else{
                //console.log(followers);
                res.status(200).json(followers);
            }

        })
})

router.get("/api/following", (req,res) =>{
    let {profileID} = req.query;
    if(!profileID){
        profileID = req.session.profile_id;
    }
    //console.log("GET /api/following");
    connection.query(
        `SELECT Profile.profile_pic_link, Profile.profile_id, Profile.display_name
         FROM Follow
         JOIN RegisteredUser ON RegisteredUser.reg_user_id = Follow.reg_user_id
         JOIN Account ON Account.user_id = RegisteredUser.user_id
         LEFT JOIN Profile ON Profile.account_id = Account.account_id
         WHERE Follow.follower_id =
         (SELECT RegisteredUser.reg_user_id
          FROM RegisteredUser
          JOIN Account ON RegisteredUser.user_id = Account.user_id
          JOIN Profile ON Account.account_id = Profile.account_id
          WHERE Profile.profile_id = ?)
        `, [profileID],
         function(err, followings){
            if(err){
                //console.log(err);
            }
            else{
                //console.log(followings);
                res.status(200).json(followings);
            }
         })
})

// router.get("/api/followers-following", (req,res) =>{
//     let 
// })


module.exports = router