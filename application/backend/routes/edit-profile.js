const express = require('express');
const connection = require('../db');
const router = express.Router();

router.post("/api/about-me", (req,res) =>{
    const {newAboutMe, profileID} = req.body;
    //may need to change this to support pet profile
    //console.log('newAboutMe: ',newAboutMe);
    //console.log('profileID: ', profileID);
    //console.log("POST /api/edit-about-me")
    connection.query(
        `UPDATE Profile
         SET about_me = '${newAboutMe}'
         WHERE profile_id = '${profileID}' `,
         function (err, result){
             if(err){
                 //console.log(err);
                 res.status(500).json(err)
             }
             //console.log(result)
             res.status(200).json(result)
         }
    )
})


router.post('/api/address',(req,res)=>{
    const {newAddress, newLatitude, newLongitude} = req.body;
    connection.query(
        `UPDATE Address
         SET address = '${newAddress}', latitude = '${newLatitude}', longitude = '${newLongitude}'
         WHERE Address.reg_user_id= '${req.session.reg_user_id}'`,
         function(err, result){
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

router.post('/api/hours', (req,res) =>{
    const {newSunOpen, newSunClose, newMonOpen, newMonClose,newTueOpen, newTueClose, newWedOpen, newWedClose, newThuOpen, newThuClose, newFriOpen, newFriClose, newSatOpen, newSatClose} = req.body;
    //console.log('newSunOpen' +newSunOpen);
    
    const query = 
    `UPDATE HoursOfOperation
     JOIN Business ON HoursOfOperation.business_id = Business.business_id
     SET sun_open='${newSunOpen}', sun_close='${newSunClose}',
        mon_open='${newMonOpen}', mon_close='${newMonClose}',
        tue_open='${newTueOpen}', tue_close='${newTueClose}',
        wed_open='${newWedOpen}', wed_close='${newWedClose}',
        thu_open='${newThuOpen}', thu_close='${newThuClose}',
        fri_open='${newFriOpen}', fri_close='${newFriClose}',
        sat_open='${newSatOpen}', sat_close='${newSatClose}'
    WHERE Business.reg_user_id = '${req.session.reg_user_id}'`
        
    //console.log(query);
    connection.query(query,
         function(err, result){
            if(err){
                //console.log(err);
                res.status(500).json(err);
            }
            else{
                //console.log(result);
                res.status(200).json(result);
            }
         }
    )
})

router.post('/api/phone-number', (req,res) =>{
    const {newPhoneNumber} = req.body;
    connection.query(
        `UPDATE Business
         SET phone_num= '${newPhoneNumber}'
         WHERE Business.reg_user_id = '${req.session.reg_user_id}'`,
         function(err, result){
            if(err){
                //console.log(err);
                res.status(500).json(err);
            }
            else{
                //console.log(result);
                res.status(200).json(result);
            }
         }
    )
})

module.exports = router