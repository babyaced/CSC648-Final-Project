const express = require('express');
const connection = require('../db');
const router = express.Router();

router.post("/api/reply",(req,res)=>{
    connection.query(
        `INSERT INTO Message (subject, body, sender_id, recipient_id, timestamp, reply_id, read_flag)
         VALUES ("RE: " + ?, ?, ?, ?, ?, ?, ?)`,[req.body.selectedMessage.subject, req.body.replyBody, req.session.reg_user_id, req.body.selectedMessage.sender_id, NOW(), req.body.selectedMessage.message_id, false],
    function(err, result){
        if(err){
            //console.log(err);
            res.status(500).json(err);
        }
        else{
            //console.log(result)
            res.status(200).json(result);
        }
    })    
})

router.get("/api/recieved-messages", (req,res) =>{
    //get message and profile pic, display_name or username?
    //console.log('/api/recieved-messages')
    connection.query(
        `SELECT * 
         FROM Message
         JOIN RegisteredUser ON Message.sender_id = RegisteredUser.reg_user_id
         JOIN Account ON RegisteredUser.user_id = Account.user_id
         LEFT JOIN Profile ON Account.account_id = Profile.account_id
         WHERE recipient_id= ?
         AND Profile.pet_id IS NULL
         ORDER BY Message.timestamp DESC
        `, [req.session.reg_user_id],
    function(err,messages){
        if(err){
            //console.log(err);
            res.status(500).json(err);
        }
        else{
            //console.log(messages)
            res.status(200).json(messages);
        }
    })
})

router.get("/api/sent-messages", (req,res) =>{
    //get message and profile pic, display_name or username?
    //console.log('/api/sent-messages')
    connection.query(
        `SELECT * 
         FROM Message
         JOIN RegisteredUser ON Message.recipient_id = RegisteredUser.reg_user_id
         JOIN Account  ON RegisteredUser.user_id = Account.user_id
         LEFT JOIN Profile ON Account.account_id = Profile.account_id
         WHERE sender_id= ?
         AND Profile.pet_id IS NULL
         ORDER BY Message.timestamp DESC
        `,[req.session.reg_user_id],
    function(err,messages){
        if(err){
            //console.log(err);
            res.status(500).json(err);
        }
        else{
            //console.log(messages)
            res.status(200).json(messages);
        }
    })
})

//for sending a message through a profile
router.post("/api/message-profile", (req,res) =>{
    //console.log(req.body);
    //console.log("POST /api/message-profile")
    connection.query(`INSERT INTO Message (subject, body, sender_id, recipient_id, timestamp) 
         VALUES (?, ?, ?, 
         (SELECT RegisteredUser.reg_user_id
          FROM RegisteredUser
          JOIN User ON RegisteredUser.user_id = User.user_id
          JOIN Account ON User.user_id = Account.user_id
          WHERE Account.account_id = ?), 
          NOW())`,[req.body.messageSubject, req.body.messageBody, req.session.reg_user_id, req.body.recipientAccountID],
    function(err,result){
        if(err){
            //console.log(err);
            res.status(500).json(err);
        }
        else{
            //console.log(result);
            res.status(200).json(result);
        }
    })
})

//for sending a message to a follower or with a username on the messages page
router.post("/api/message",(req,res) =>{
    //console.log(req.body);
    //console.log(req.session.reg_user_id);
    //console.log("POST /api/message")
    connection.query(`INSERT INTO Message (subject, body, sender_id, recipient_id, timestamp) 
        VALUES (?, ?, ?, 
        (SELECT RegisteredUser.reg_user_id
         FROM RegisteredUser
         JOIN User ON RegisteredUser.user_id = User.user_id
         JOIN Account ON User.user_id = Account.user_id
         JOIN Profile ON Profile.account_id = Account.account_id
         WHERE Profile.profile_id = ?), 
         NOW())`, [req.body.messageSubject, req.body.messageBody, req.session.reg_user_id, req.body.recipientProfileID],
    function(err,result){
        if(err){
            //console.log(err);
            res.status(500).json(err);
        }
        else{
            //console.log(result);
            res.status(200).json(result);
        }
    })
})

// router.get("/api/replies", (req,res) =>{
//      connection.query
//          (`SELECT *
//           FROM Message
//           WHERE Message.message_id =
//           () Message.reply_Id`)
// })

module.exports = router