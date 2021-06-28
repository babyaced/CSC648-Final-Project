const express = require("express");
const router = express.Router();

const connection = require("../db");

router.post("/", (req, res) => {
  // follow user
  console.log("POST /api/follow-unfollow-user");
  const { accountId } = req.body;

  console.log(req.session.reg_user_id);

  connection.query(
    `INSERT INTO Follow (follower_id, reg_user_id) 
         VALUES (?,
                (SELECT RegisteredUser.reg_user_id 
                 FROM RegisteredUser
                 JOIN Account ON Account.user_id = RegisteredUser.user_id
                 WHERE Account.account_id = ?
                 ))`,
    [req.session.reg_user_id, accountId],
    function (err, follow) {
      //anytime we use the currently logged in user's information we use the id stored in session
      if (err) {
        console.error(err);
        if ((err.errno = 1062)) {
          //if duplicate key error means that the post has already been liked by the user
          //console.log(1062);
          connection.query(
            `DELETE FROM Follow 
                            WHERE Follow.reg_user_id = ? 
                            AND Follow.follower_id = (SELECT RegisteredUser.reg_user_id 
                                FROM RegisteredUser
                                JOIN Account ON Account.user_id = RegisteredUser.user_id
                                WHERE Account.account_id = ?
                                )`,
            [accountId, req.session.reg_user_id],
            function (err, result) {
              if (err) {
                //console.log(err);
              } else {
                //console.log("Follower has been deleted")
                //console.log(result);
                res.status(200).json(result);
                res.end;
              }
            }
          );
        }
      } else {
        //console.log("Follower has been added");
        //We don't have followers_count in Profile database entity but I think we should,
        // then it would be updated in this section.
        res.status(200).json(follow);
        res.end;
      }
    }
  );
});

module.exports = router;
