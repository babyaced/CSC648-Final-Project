const express = require('express');
const connection = require('../db');
const router = express.Router();

router.post("/api/create-pet-profile",(req,res)=>{
    //console.log("POST /api/create-pet-profile");
    //console.log("req.body: ", req.body);
    let insertedPet

    // if(req.body.dogBreed.length != 0){
    //     //console.log("Its a dog!")
    // }
    // else if(req.body.catBreed.length != 0){
    //     //console.log("Its a cat!")
    // }
    // else{
    //     //console.log("Its another pet!")
    // }

    //MAKE THIS INTO A TRANSACTION LATER
    connection.query(
         `INSERT INTO Pet
         (age_id, size_id, reg_user_id, name, type_id)
         VALUES ('${req.body.age.value}','${req.body.size.value}','${req.session.reg_user_id}','${req.body.name}', '${req.body.type.value}')`,
         function(err, userPet){
             if(err){
                 //console.log(err);
             }
             else{
                //console.log("Inserted Pet successfully");
                //console.log(userPet);
                insertedPet = userPet
                 connection.query(
                     `INSERT INTO Profile
                      (display_name,about_me, account_id, pet_id, type)
                      VALUES (?, ?, 
                      (SELECT Account.account_id
                        FROM Account
                        JOIN RegisteredUser ON RegisteredUser.reg_user_id = ?
                        WHERE Account.user_id = RegisteredUser.user_id),
                      ?,
                      'Pet')`, [req.body.name, '', req.session.reg_user_id, userPet.insertId],
                      function(err, result){
                          if(err){
                              //console.log(err);
                          }
                          else{
                              //console.log(result);
                              for(let i = 0; i < req.body.color.length; i++){
                                connection.query(`INSERT INTO PetColor (pet_id,color_id) VALUES (?,?)`, [userPet.insertId, req.body.color[i].value],
                                    function(err, result){
                                        if(err){
                                            //console.log(err);
                                        //  res.status(500).json(err);
                                        //  res.end();
                                        }
                                        else{
                                            //console.log(req.body.color[i].label + " inserted")
                                        }
                                    }
                                )
                                }

                                if(req.body.dogBreed.length !== 0 && req.body.type.label == 'Dog'){
                                    connection.query(`INSERT INTO Dog (pet_id) VALUES (?)`, [userPet.insertId],
                                    function(err, insertedDog){
                                        if(err){
                                            //console.log(err);
                                            // res.status(500).json(err);
                                        }
                                        else{
                                            //console.log("Inserted Dog successfully");
                                            //console.log(insertedDog);
                                            for(let i = 0; i < req.body.dogBreed.length; i++){
                                                connection.query(`INSERT INTO DogBreeds (dog_id, breed_id) VALUES (?,?)`, [insertedDog.insertId, req.body.dogBreed[i].value],
                                                    function(err,insertedDogBreed){
                                                        if(err){
                                                            //console.log(err);
                                                            // res.status(500).json(err);
                                                        }
                                                        else{
                                                            //console.log("Dog Breed: ", req.body.dogBreed[i].label, " inserted");
                                                        }
                                                })
                                            }
                                            res.status(200).json(insertedDog);
                                        }
                                    })
                                }
                                else if(req.body.catBreed.length !== 0 && req.body.type.label == 'Cat'){
                                    connection.query(`INSERT INTO Cat (pet_id) VALUES (?)`, [userPet.insertId],
                                    function(err, insertedCat){
                                        if(err){
                                            //console.log(err);
                                            // res.status(500).json(err);
                                        }
                                        else{
                                            //console.log("Inserted Cat successfully");
                                            //console.log(insertedCat);
                                            for(let i = 0; i < req.body.catBreed.length; i++){
                                                connection.query(`INSERT INTO CatBreeds (cat_id, breed_id) VALUES (?,?)`, [insertedCat.insertId, req.body.catBreed[i].value],
                                                function(err,insertedCatBreed){
                                                    if(err){
                                                        //console.log(err);
                                                    }
                                                    else{
                                                        //console.log("Cat Breed: ",req.body.catBreed[i].label, " inserted");
                                                    }
                                                })
                                            }
                                            res.status(200).json(insertedCat);
                                            // res.end();
                                        }
                                    })
                                }
                                else{
                                    res.status(200).json(insertedPet);
                                }
                          }
                    })
                }
    })
    
})

router.get("/api/tagged-posts", (req,res) =>{
    console.log("GET /api/tagged-posts");

    connection.query(
        `SELECT * 
         FROM Photo
         LEFT JOIN Post ON Photo.post_id = Post.post_id
         JOIN RegisteredUser ON RegisteredUser.reg_user_id = Post.reg_user_id
         JOIN Account ON RegisteredUser.user_id = Account.user_id
         JOIN Profile ON Account.account_id = Profile.account_id
         WHERE Photo.post_id 
         IN
         (SELECT PostTag.post_id
          FROM PostTag 
          WHERE PostTag.pet_id = Profile.pet_id)
          AND Profile.profile_id = ?`, [req.query.profileID],
         function(err, taggedPosts){
             if(err){
                 //console.log(err);
             }
             else{
                 //console.log(taggedPosts);
                 res.status(200).json(taggedPosts);
             }
         })
})

module.exports = router