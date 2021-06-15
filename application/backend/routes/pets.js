const express = require('express');
const connection = require('../db');
const router = express.Router();

router.get("/api/current-user-pets",(req,res)=>{
    //console.log("GET /api/current-user-pets");

    //get all profiles that are owned by the current user, but only the profiles associated with pets and not the profile that is the profile the user is on already
    connection.query(
        `SELECT *
         FROM Profile
         WHERE 
         (Profile.account_id = (SELECT Account.account_id FROM Account JOIN Profile ON Profile.profile_id = '${req.session.profile_id}' WHERE Account.account_id = Profile.account_id)) AND (Profile.profile_id != '${req.session.profile_id}') AND (Profile.pet_id IS NOT NULL)`,
         function(err, userPets){
             if(err){
                 //console.log(err);
             }
             //console.log("userPets: ",userPets);
             res.status(200).json(userPets);
         })
})

router.get("/api/pets",(req,res)=>{
    //console.log("/api/pets");

    const {profileID} = req.query;

    //console.log(profileID)
    
    //get all profiles that are owned by the current user, but only the profiles associated with pets
    connection.query(
        `SELECT *
         FROM Profile
         WHERE 
         (Profile.account_id = (SELECT Account.account_id FROM Account JOIN Profile ON Profile.profile_id = '${profileID}' WHERE Account.account_id = Profile.account_id)) AND (Profile.profile_id != '${profileID}')  AND (Profile.pet_id IS NOT NULL)`,
         function(err, userPets){
             if(err){
                 //console.log(err);
             }
            //  //console.log("userPets: ",userPets);
             res.status(200).json(userPets);
         })
})


router.post("/api/delete-pet",(req,res) =>{
    const {petProfileID} = req.body

    //console.log("POST /api/delete-pet");
    //console.log(petProfileID)

    connection.query(
        `DELETE Pet
         FROM Pet
         INNER JOIN Profile ON Profile.pet_id = Pet.pet_id
         WHERE Profile.profile_id = ${petProfileID}
        `,
        function(err, result){
            if(err){}
                //console.log(err);
            else{
                res.status(200).json(result);
            }
        }
    )
})

// router.post("/api/edit-pet",(req,res) =>{
//     const {petProfileID, newName, new} = req.body
//     //console.log("POST /api/edit-pet");

//     connection.query(
//         `UPDATE Pet
//          JOIN Profile ON Profile.profile_id = ${petProfileID} 
//          SET Pet.name =`
//     )

// })

module.exports = router