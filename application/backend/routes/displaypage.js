const express = require('express');
const router = express.Router();

const connection = require('../db');

router.get("/api/user/:user", (req, res) => {
    var userInfo = {userResults:[]}
    var urlArray = req.query.id.split("/")
    // //console.log(urlArray[2])
    connection.query(
        "SELECT * FROM User WHERE user_id=?", urlArray[2],
        function(err, result) {
        if(err){
            throw err;
        } else {

            Object.keys(result).forEach(function(key) {
                var row = result[key];
                userInfo.userResults.push({
                    "user_id": row.user_id,
                    "first_name": row.first_name,
                    "last_name": row.last_name,
                    "full_name": row.full_name
                });
              });
            // //console.log(userInfo);
            res.json(userInfo);
        }
    });
});

router.get("/api/pet/:pet", (req, res) => {
    var petInfo = {petResults:[]}
    var urlArray = req.query.id.split("/")
    // //console.log(urlArray[2])
    connection.query(
        "SELECT * FROM Pet WHERE pet_id=?", urlArray[2],
        function(err, result) {
        if(err){
            throw err;
        } else {

            Object.keys(result).forEach(function(key) {
                var row = result[key];
                petInfo.petResults.push({
                    "pet_id": row.pet_id,
                    "name": row.name,
                    "size_id": row.size_id,
                    "age_id": row.age_id,
                    "user_id": row.reg_user_id,
                    "profile_pic": row.profile_pic
                });
              });
            // //console.log(petInfo);
            res.json(petInfo);
        }
    });
});

router.get("/api/business/:business", (req, res) => {
    var businessInfo = {businessResults:[]}
    var urlArray = req.query.id.split("/")
    // //console.log(urlArray[2])
    connection.query(
        "SELECT * FROM Business WHERE business_id=?", urlArray[2],
        function(err, result) {
        if(err){
            throw err;
        } else {

            Object.keys(result).forEach(function(key) {
                var row = result[key];
                businessInfo.businessResults.push({
                    "business_id": row.business_id,
                    "name": row.name,
                    "phone_num" : row.phone_num,
                    "reg_user_id" : row.reg_user_id
                });
              });
            // //console.log(businessInfo);
            res.json(businessInfo);
        }
    });
});

router.get("/api/shelter/:shelter", (req, res) => {
    var shelterInfo = {shelterResults:[]}
    var urlArray = req.query.id.split("/")
    // //console.log(urlArray[2])
    connection.query(
        "SELECT * FROM Shelter WHERE shelter_id=?", urlArray[2],
        function(err, result) {
        if(err){
            throw err;
        } else {

            Object.keys(result).forEach(function(key) {
                var row = result[key];
                shelterInfo.shelterResults.push({
                    "shelter_id": row.shelter_id,
                    "business_id": row.business_id
                });
              });
            // //console.log(shelterInfo);
            res.json(shelterInfo);
        }
    });
});

module.exports = router