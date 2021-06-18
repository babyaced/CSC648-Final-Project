const express = require('express');
const router = express.Router();

const connection = require('../db');

router.get('/api/hours', (req,res)=>{
    const {profileID} = req.query
    connection.query(
        `SELECT sun_open, sun_close,mon_open, mon_close,tue_open, tue_close,wed_open, wed_close,thu_open, thu_close,fri_open, fri_close, sat_open, sat_close
         FROM HoursOfOperation
         JOIN Business ON HoursOfOperation.business_id = Business.business_id
         JOIN RegisteredUser ON Business.reg_user_id =  RegisteredUser.reg_user_id
         JOIN Account ON RegisteredUser.user_id = Account.user_id
         JOIN Profile ON Profile.profile_id = ?
         WHERE Account.account_id = Profile.account_id
        `,[profileID],
        function(err,hours){
            if(err){
                // //console.log(err)
                res.status(500).json(err);
            }
            else{
                // //console.log("hours[0]: ",hours[0])
                let hourOptions = []
                let hourObject = {}
                hours = hours[0]
                Object.keys(hours).forEach( (key) =>{
                    // //console.log('hours[key]: ', hours[key])
                    // //console.log('key: ',key);
                    switch(hours[key]){
                        case '00:00:00':
                            hourObject[key] = {value: hours[key], label:'Closed'}
                            break
                        case '01:00:00':
                            hourObject[key] = {value: hours[key], label:'1:00 AM'}
                            break
                        case '02:00:00':
                            hourObject[key] = {value: hours[key], label:'2:00 AM'}
                            break
                        case '03:00:00':
                            hourObject[key] = {value: hours[key], label:'3:00 AM'}
                            break
                        case '04:00:00':
                            hourObject[key] = {value: hours[key], label:'4:00 AM'}
                            break
                        case '05:00:00':
                            hourObject[key] = {value: hours[key], label:'5:00 AM'}
                            break
                        case '06:00:00':
                            hourObject[key] = {value: hours[key], label:'6:00 AM'}
                            break
                        case '07:00:00':
                            hourObject[key] = {value: hours[key], label:'7:00 AM'}
                            break
                        case '08:00:00':
                            hourObject[key] = {value: hours[key], label:'8:00 AM'}
                            break
                        case '09:00:00':
                            hourObject[key] = {value: hours[key], label:'9:00 AM'}
                            break
                        case '10:00:00':
                            hourObject[key] = {value: hours[key], label:'10:00 AM'}
                            break
                        case '11:00:00':
                            hourObject[key] = {value: hours[key], label:'11:00 AM'}
                            break
                        case '12:00:00':
                            hourObject[key] = {value: hours[key], label:'12:00 PM'}
                            break
                        case '13:00:00':
                            hourObject[key] = {value: hours[key], label:'1:00 PM'}
                            break
                        case '14:00:00':
                            hourObject[key] = {value: hours[key], label:'2:00 PM'}
                            break
                        case '15:00:00':
                            hourObject[key] = {value: hours[key], label:'3:00 PM'}
                            break
                        case '16:00:00':
                            hourObject[key] = {value: hours[key], label:'4:00 PM'}
                            break
                        case '17:00:00':
                            hourObject[key] = {value: hours[key], label:'5:00 PM'}
                            break
                        case '18:00:00':
                            hourObject[key] = {value: hours[key], label:'6:00 PM'}
                            break
                        case '19:00:00':
                            hourObject[key] = {value: hours[key], label:'7:00 PM'}
                            break
                        case '20:00:00':
                            hourObject[key] = {value: hours[key], label:'8:00 PM'}
                            break
                        case '21:00:00':
                            hourObject[key] = {value: hours[key], label:'9:00 PM'}
                            break
                        case '22:00:00':
                            hourObject[key] = {value: hours[key], label:'10:00 PM'}
                            break
                        case '23:00:00':
                            hourObject[key] = {value: hours[key], label:'11:00 PM'}
                            break
                        case '24:00:00':
                            hourObject[key] = {value: hours[key], label:'12:00 AM'}
                            break
                        default:
                            hourObject[key] = {value: '00:00:00', label:'Closed'}
                            break
                    }
                })
                // //console.log('hourObject: ', hourObject)
                res.status(200).json(hourObject);
            }
        })
})

router.get('/api/business-address', (req,res)=>{
    // //console.log('GET /api/business-address');
    connection.query(
        `SELECT address
         FROM Address
         JOIN RegisteredUser ON Address.reg_user_id =  RegisteredUser.reg_user_id
         JOIN Account ON RegisteredUser.user_id = Account.user_id
         JOIN Profile ON Profile.profile_id = ?
         WHERE Account.account_id = Profile.account_id
        `, [req.query.profileID],
        function(err,address){
            if(err){
                // //console.log(err)
                res.status(500).json(err);
            }
            else{
                // //console.log("address: ",address)
                res.status(200).json(address[0]);
            }
        })
})

router.get('/api/business-phone-number', (req,res)=>{
    // //console.log('GET /api/business-address');
    connection.query(
        `SELECT phone_num
         FROM Business
         JOIN RegisteredUser ON Business.reg_user_id =  RegisteredUser.reg_user_id
         JOIN Account ON RegisteredUser.user_id = Account.user_id
         JOIN Profile ON Profile.profile_id = ?
         WHERE Account.account_id = Profile.account_id
        `,[req.query.profileID],
        function(err,number){
            if(err){
                // //console.log(err)
                res.status(500).json(err);
            }
            else{
                // //console.log("phone number: ",number)
                res.status(200).json(number[0]);
            }
        })
})

router.post('/api/address', (req,res) =>{
    const {newAddress, newLatitude, newLongitude} = req.body
    // //console.log('POST /api/address')
    connection.query(
        `UPDATE Address
         SET address = ?, latitude= ?,longitude = ?
         WHERE address.reg_user_id = ?
        `, [newAddress, newLatitude, newLongitude, req.session.reg_user_id],
        function(err,result){
            if(err){
                // //console.log(err)
                res.status(500).json(err);
            }
            else{
                // //console.log("result: ", result)
                res.status(200).json(result)
            }
        }
    )
})

module.exports = router