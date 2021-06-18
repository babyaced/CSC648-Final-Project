const express = require("express");
const router = express.Router();

const connection = require("../db");

router.get("/api/business-types", (req, res) => {
  console.log("GET /api/business-types");
  connection.query(
    "SELECT * FROM BusinessType ORDER BY business_type_name",
    function (err, businessTypes) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      let businessCategoryOptions = [];
      for (let i = 0; i < businessTypes.length; i++) {
        businessCategoryOptions.push({
          value: businessTypes[i].business_type_id,
          label: businessTypes[i].business_type_name,
        });
      }
      //console.log(businessTypes)
      res.status(200).json(businessCategoryOptions);
    }
  );
});

router.get("/api/pet-types", (req, res) => {
  console.log("GET /api/pet-types");
  connection.query(
    "SELECT * FROM PetType ORDER BY pet_type_name",
    function (err, petTypes) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      let petTypeOptions = [];
      for (let i = 0; i < petTypes.length; i++) {
        petTypeOptions.push({
          value: petTypes[i].pet_type_id,
          label: petTypes[i].pet_type_name,
        });
      }
      //console.log("Pet Type Option: ", petTypeOptions);
      res.status(200).json(petTypeOptions);
    }
  );
});

router.get("/api/dog-breeds", (req, res) => {
  console.log("GET /api/dog-breeds");
  connection.query(
    "SELECT * FROM DogBreed ORDER BY dog_breed_name",
    function (err, dogBreeds) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      let dogBreedOptions = [];
      for (let i = 0; i < dogBreeds.length; i++) {
        dogBreedOptions.push({
          value: dogBreeds[i].dog_breed_id,
          label: dogBreeds[i].dog_breed_name,
        });
      }
      //console.log("Pet Type Dropdown Content: ", dogBreedOptions);
      //console.log(dogBreeds)
      res.status(200).json(dogBreedOptions);
    }
  );
});

router.get("/api/cat-breeds", (req, res) => {
  console.log("GET /api/cat-breeds");
  connection.query(
    "SELECT * FROM CatBreed ORDER BY cat_breed_name",
    function (err, catBreeds) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      let catBreedOptions = [];
      for (let i = 0; i < catBreeds.length; i++) {
        catBreedOptions.push({
          value: catBreeds[i].cat_breed_id,
          label: catBreeds[i].cat_breed_name,
        });
      }
      //console.log(catBreeds)
      res.status(200).json(catBreedOptions);
    }
  );
});

router.get("/api/ages", (req, res) => {
  console.log("GET /api/ages");
  connection.query("SELECT * FROM Age ORDER BY age_id", function (err, ages) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }
    let ageOptions = [];
    for (let i = 0; i < ages.length; i++) {
      ageOptions.push({ value: ages[i].age_id, label: ages[i].age_name });
    }
    //console.log(ages)
    res.status(200).json(ageOptions);
  });
});

router.get("/api/sizes", (req, res) => {
  console.log("GET /api/sizes");
  connection.query(
    "SELECT * FROM Size ORDER BY size_id",
    function (err, sizes) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      let sizeOptions = [];
      for (let i = 0; i < sizes.length; i++) {
        sizeOptions.push({
          value: sizes[i].size_id,
          label: sizes[i].size_name,
        });
      }
      //console.log(sizes)
      res.status(200).json(sizeOptions);
    }
  );
});

router.get("/api/colors", (req, res) => {
  connection.query(
    "SELECT * FROM Color ORDER BY color_name",
    function (err, colors) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      let colorOptions = [];
      for (let i = 0; i < colors.length; i++) {
        colorOptions.push({
          value: colors[i].color_id,
          label: colors[i].color_name,
        });
      }
      //console.log(colors)
      res.status(200).json(colorOptions);
    }
  );
});

// router.get('/api/messaging-options',(req,res) =>{
//     console.log('/api/messaging-options');
//     const {profileID} = req.query;
//     connection.query(
//         `SELECT RegisteredUser.reg_user_id, Follow.reg_user_id, Profile.profile_pic_link, Profile.profile_id, Profile.display_name
//         FROM Follow
//         JOIN RegisteredUser ON RegisteredUser.reg_user_id = Follow.follower_id
//         JOIN Account ON Account.user_id = RegisteredUser.user_id
//         LEFT JOIN Profile ON Profile.account_id = Account.account_id
//         WHERE Follow.reg_user_id =
//         (SELECT RegisteredUser.reg_user_id
//         FROM RegisteredUser
//         JOIN Account ON RegisteredUser.user_id = Account.user_id
//         JOIN Profile ON Account.account_id = Profile.account_id
//         WHERE Profile.profile_id = '${profileID}')
//         OR Follow.follower_id =
//         (SELECT RegisteredUser.reg_user_id
//             FROM RegisteredUser
//             JOIN Account ON RegisteredUser.user_id = Account.user_id
//             JOIN Profile ON Account.account_id = Profile.account_id
//             WHERE Profile.profile_id = '${profileID}')`,
//         function(err,results ){
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 console.log(results)
//                 res.status(200).json(results);
//             }
//         })
// })

module.exports = router;
