const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


const connection = require('../db');

router.get("/api/login",(req, res) =>{ //check if user is logged in
    // //console.log(req.session);
    if(req.session.username){
        res.send({username: req.session.username, role: req.session.role, profileID: req.session.profile_id})
    } else{
        res.send() 
    }
})

router.post("/api/login", (req, res) =>{ //login user
    //console.log("/login")
    const username = req.body.username;
    const password = req.body.password;
    //console.log(username);
    //console.log(password);
    
    if(username && password){
        connection.query(
            `SELECT * 
             FROM Credentials
             LEFT JOIN Account ON Credentials.acct_id = Account.account_id
             LEFT JOIN User ON Account.user_id = User.user_id
             LEFT JOIN RegisteredUser ON User.user_id = RegisteredUser.user_id
             LEFT JOIN Profile ON Account.account_id = Profile.account_id
             WHERE username = ?`, 
             [username], function(error, results, fields){
                if(results.length > 0 && username == results[0].username){
                    var passwordMatch = bcrypt.compareSync(password, results[0].password);
                    if (passwordMatch) { 
                        req.session.loggedin = true;
                        req.session.username = username;
                        req.session.role = results[0].role_id;
                        req.session.reg_user_id = results[0].reg_user_id;
                        req.session.profile_id = results[0].profile_id;
                        //console.log("Req.session.username: ", req.session.username);
                        //console.log(passwordMatch);
                        //console.log(results);
                        res.status(200).json(
                            {
                                username: results[0].username,
                                role: results[0].role_id,
                                profileID: results[0].profile_id
                            }
                        )
                        //console.log("Logged in.");    
                    }
                    else{
                        //console.log("Password is incorrect");
                        res.status(400).json("no match");
                    }
                }else{
                    //console.log("Username is incorrect");
                    res.status(400).json("no match");
                    // res.send("Username or password is incorrect");
                }
            // res.end();
        });
    }else{
        //console.log("Please enter information correctly");
        res.status(400).json("incomplete");
    }
}
);

module.exports = router