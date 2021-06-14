const express = require('express');
const connection = require('../db');
const router = express.Router();

router.get("/api/get-profile-pic", (req,res) =>{
    connection.query(
        `SELECT Profile.profile_pic_link
         FROM Profile
         JOIN Credentials ON Credentials.acct_id = Profile.account_id
         WHERE Credentials.username = '${req.session.username}'`,
        function(err,link){
            if(err)
                console.log(err);
            else{
                res.status(200).json(link[0]); //should be only one profile pic
            }
        }
    )
})

router.get("/api/profile", (req,res) =>{
    let selfViewFlag=false
    let adminViewFlag=false
    console.log("GET /api/profile")
    connection.query(
        `SELECT Profile.profile_pic_link, Profile.display_name, Profile.about_me, Profile.type, Profile.account_id, Profile.profile_id, Pet.reg_user_id,Profile.pet_id
         FROM Profile
         LEFT JOIN Pet ON Profile.pet_id = Pet.pet_id
         WHERE Profile.profile_id = '${req.query.profileID}'`,
         function(err, profile){
             if(err){
                console.log(err);
                res.status(500).json(err);
             }
             else if(profile[0] && profile[0].pet_id === null){ //if its not a pet profile, no need to check if the pet is owned by the profile viewer
                console.log(profile);
                console.log("not a pet profile")
                 if(profile[0].profile_id === req.session.profile_id){ //if the profile id is the same as the user who is currently logged in
                     //then set selfView flag to true
                     console.log("profile owned by logged in user")
                     selfViewFlag = true;
                 }
             }
             else{ //its a pet_profile
                console.log("pet profile")
                 if(profile[0] && profile[0].reg_user_id === req.session.reg_user_id){ //if pets reguserid (owner) matches currently logged in user
                    console.log("pet owned by profile viewer")
                     //then set selfView flag to true
                     selfViewFlag = true
                 }
             }
             if(req.session.role === 4){ //if the logged in user is an admin
                adminViewFlag = true
             }
             let response = {
                 profile : profile[0],
                 selfView: selfViewFlag,
                 adminView: adminViewFlag
             }
             res.status(200).json(response);
         }
         

    )
})

router.get("/api/photo-posts", (req,res) =>{
    console.log(req.query);
    console.log("GET /api/photo-posts")
    connection.query(
        `SELECT *
         FROM Photo
         LEFT JOIN Post ON Photo.post_id = Post.post_id
         JOIN RegisteredUser ON Post.reg_user_id = RegisteredUser.reg_user_id
         JOIN Account ON RegisteredUser.user_id = Account.user_id
         JOIN Profile ON Account.account_id = Profile.account_id
         WHERE Profile.profile_id = '${req.query.profileID}'`,
        function(err, photoPosts){
            if(err){
               console.log(err);
            }
            else{
                console.log("photoPosts: ", photoPosts);
                res.status(200).json(photoPosts);
            }
        }
    )
})

router.post("/api/profile-pic", (req,res) =>{
    console.log(req.body);
    const {photoLink, profileID, profileType} = req.body // profileID only used if its a pet profile we want to update
    console.log("POST /api/profile-pic")
    if(profileType === 'Pet'){ //we need to update pet's profile pic and also make sure that the updating party is the owner of the pet
        connection.query(`
        UPDATE Profile 
        JOIN Pet ON Pet.pet_id = Profile.pet_id 
        SET profile_pic_link = '${photoLink}'
        WHERE Profile.profile_id = ${profileID}
        AND Pet.reg_user_id = ${req.session.profile_id}`,
            function(err, result){
                if(err){
                    console.log(err)
                    res.status(500).json(err);
                }
                else{
                    console.log(result);
                    res.status(200).json(result);
                }
            }
        )
    }
    else{
        connection.query(`UPDATE Profile SET profile_pic_link = '${photoLink}' WHERE Profile.profile_id =${req.session.profile_id}`,
            function(err, result){
                if(err){
                    console.log(err)
                    res.status(500).json(err);
                }
                else{
                    console.log(result);
                    res.status(200).json(result);
                }
            }
        )
    }
})

router.get("/api/profile-display-name", (req,res) =>{
    console.log(req.body);
    console.log("GET /api/profile-display-name")
    connection.query(`SELECT Profile.display_name
     FROM Profile
     WHERE Profile.profile_id = '${req.query.profileID}'`,
        function(err, results){
            if(err){
                console.log(err)
                res.status(500).json(err);
            }
            else{
                console.log(results);
                res.status(200).json(results[0]);
            }
        }
    )
})

router.get("/api/is-following", (req,res) =>{
    const {profileID} = req.query
    console.log('GET /api/is-following')
    connection.query(`
        SELECT *
        FROM Follow
        WHERE reg_user_id=
        (SELECT RegisteredUser.reg_user_id
         FROM RegisteredUser
         JOIN Account ON Account.user_id = RegisteredUser.user_id
         JOIN Profile ON Profile.account_id = Account.account_id
         WHERE Profile.profile_id = ?)
        AND follower_id=
        (SELECT RegisteredUser.reg_user_id
         FROM RegisteredUser
         JOIN Account ON Account.user_id = RegisteredUser.user_id
         JOIN Profile ON Profile.account_id = Account.account_id
         WHERE Profile.profile_id = ?)`,[profileID, req.session.profile_id],
        function(err,results){
            if(err){
                console.log(err)
                res.status(500).json(err)
            }
            else{
                console.log(results);
                if(results.length !== 0)
                    res.status(200).json(true)
                else
                    res.status(200).json(false)               
            }
        }
    )
})

router.post('/api/name',(req, res)=>{
    console.log('POST /api/name')
    const {newFirstName} = req.body
    console.log('newFirstName: ', newFirstName)
    connection.getConnection(function(err,conn){
        if(err){
            console.log(err)
            res.status(500).json(err);
        }
        conn.beginTransaction(function(err){
            if(err){
                console.log(err);
                res.status(500).json(err);
            }
            conn.query(`
            UPDATE Profile
            SET Profile.display_name = '${newFirstName}'
            WHERE Profile.profile_id = ${req.session.profile_id}`,
            function(err,result){
                if(err){
                    return conn.rollback(function(){
                        throw err;
                    })
                }
                console.log('display name updated')
                conn.query(`
                UPDATE User
                JOIN Account ON Account.user_id = User.user_id
                JOIN Profile ON Profile.account_id = Account.account_id
                SET User.first_name = '${newFirstName}'
                WHERE Profile.profile_id = ${req.session.profile_id}`,
                function(err,result){
                    if(err){
                        return conn.rollback(function(){
                            throw err;
                        })
                    }
                    console.log('updated user first name')
                    conn.commit(function(err){
                        if(err){
                            return conn.rollback(function(){
                                throw err;
                            })
                        }
                        console.log('success!')
                        res.status(200).json('success')
                    })
                })
            })
        })
    })
})

router.get('/api/pet-details', (req,res) =>{
    console.log('GET /api/pet-details')

    const {petID} = req.query;
    console.log('petID: ', petID)
    connection.query(`
        SELECT Pet.type_id, Pet.size_id, Pet.age_id
        FROM Pet
        WHERE Pet.pet_id = ?`,[petID],
        function(err, result){
            if(err){
                console.log(err)
            }
            else{
                console.log(result)
            }
        }
    )
    
})

module.exports = router

//GROUP_CONCAT(DogBreeds.breed_id), GROUP_CONCAT(CatBreeds.breed_id), GROUP_CONCAT(PetColor.color_id), 
// JOIN PetColor ON PetColor.pet_id = Pet.pet_id
// JOIN Dog ON Dog.pet_id = Pet.pet_id
// JOIN DogBreeds ON DogBreeds.dog_id = Dog.dog_id
// JOIN Cat ON Cat.pet_id = Pet.pet_id
// JOIN CatBreeds ON CatBreeds.cat_id = Cat.cat_id