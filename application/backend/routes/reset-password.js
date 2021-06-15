const express = require('express');
const connection = require('../db');
const router = express.Router();

const nodemailer = require('nodemailer');
const randomToken = require('random-token');

router.post("/api/resetpassword", (req, res) => {
    //console.log("/resetpassword")

    const email = req.body.email;
    const token = randomToken(16);

    //console.log(email)
    if(req.body.email == ''){
        res.status(400).send('Email required');
    }

    connection.query('SELECT * FROM User WHERE email = ?', [email], function(error, results, fields){
        //console.log(results)
        if(results.length > 0 && email == results[0].email){
            // Needs to be inserted into a "token" column in the user in the
            // database
            const resetPasswordToken = token;
            const passwordExpires = Date.now() + 140000000;
            connection.query(`UPDATE Credentials SET reset_token =?, reset_expiry = NOW() + INTERVAL 48 HOUR WHERE email= ?`,[resetPasswordToken, email], 
            function(error, results, fields){
                //console.log("Inserted Token and Expiry")
            });        
            
        }else{
            //console.log("No Email");
            res.status(400).json("no email exists");
        }
    });

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'zoobleinc@gmail.com',
            pass: 'Testtest9!'
        }
    });

    const mailOptions = {
        from: 'mySqlDemoEmail@gmail.com',
        to: `${email}`,
        subject: `Link to Reset Zooble Password`,
        text:
            'You are recieving this email because you (or another party) have requested the reset of the password \n\n' +
            'associated with your account. Please click on the following link, or paste this into your browser to \n\n' +
            'complete the process: \n\n' +
            `zooble.link/reset/${token}\n\n` +
            'If you did not request the reset, please ignore this e-mail. \n',
    };

    transporter.sendMail(mailOptions, (err, response) => {
        if(err){
            console.error("Error: ", err);
        } else {
            //console.log("Here is the response: ", response);
            res.status(200).json('recovery email sent');
        }
    });
});

module.exports = router