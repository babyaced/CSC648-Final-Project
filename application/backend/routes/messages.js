const express = require("express");
const connection = require("../db");
const router = express.Router();

router.get("/recieved", (req, res) => {
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
        `,
    [req.session.reg_user_id],
    function (err, messages) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      } else {
        //console.log(messages)
        res.status(200).json(messages);
      }
    }
  );
});

router.get("/sent", (req, res) => {
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
        `,
    [req.session.reg_user_id],
    function (err, messages) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      } else {
        //console.log(messages)
        res.status(200).json(messages);
      }
    }
  );
});

// router.get("/api/replies", (req,res) =>{
//      connection.query
//          (`SELECT *
//           FROM Message
//           WHERE Message.message_id =
//           () Message.reply_Id`)
// })

module.exports = router;
