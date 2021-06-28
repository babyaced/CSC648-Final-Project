const express = require("express");
const router = express.Router();
const SQL = require("sql-template-strings");

const connection = require("../db");

function distance(lat1, lat2, lon1, lon2) {
  //for calculating distance between two lat,lng
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return c * r;
}

router.get("/", (req, res) => {
  var requestedSearchResults = { searchResults: [] };
  //console.log("/search");
  if (req.query.searchTerm) {
    var name = req.query.searchTerm.toLowerCase();
    name = "%" + name + "%";
  } else {
    name = "%%";
  }

  const {
    searchCategory,
    searchLatitude,
    searchLongitude,
    searchDistance,
    searchPage,
    searchBizCategories,
    searchPetTypes,
    searchPetColors,
    searchPetSizes,
    searchPetAges,
    searchCatBreeds,
    searchDogBreeds,
  } = req.query;

  //console.log("Name: ",name);
  //console.log("Category: ",searchCategory);
  //console.log("Given Latitude: ",searchLatitude);
  //console.log("Given Longitude: ", searchLongitude);
  //console.log("Preferred Search Distance: ", searchDistance);
  //console.log("Given Page: ", searchPage);
  //console.log("Search Dog breeds: ", searchDogBreeds)

  if (searchCategory == "Pets") {
    const query = SQL``;
    if (
      (searchPetTypes && searchPetTypes !== undefined) ||
      (searchPetColors && searchPetColors !== undefined) ||
      (searchPetSizes && searchPetSizes !== undefined) ||
      (searchPetAges && searchPetAges !== undefined) ||
      (searchDogBreeds && searchDogBreeds !== undefined) ||
      (searchCatBreeds && searchCatBreeds !== undefined)
    ) {
      query.append(SQL`SELECT *,
             (3959 * acos(cos(radians(${searchLatitude}))* cos(radians(Address.latitude))* cos(radians(Address.longitude) - radians(${searchLongitude})) + sin(radians(${searchLatitude})) * sin(radians(Address.latitude)))) as distance 
             FROM Pet
             LEFT JOIN Profile ON Profile.pet_id = Pet.pet_id
             LEFT JOIN Address ON Address.reg_user_id = Pet.reg_user_id
             LEFT JOIN Age ON Pet.age_id = Age.age_id
             LEFT JOIN Size ON Pet.size_id = Size.size_id
             LEFT JOIN Dog ON Pet.pet_id = Dog.pet_id
             LEFT JOIN Cat On Pet.pet_id = Cat.pet_id
             HAVING LOWER(name) LIKE ${name}
             AND distance <  ${searchDistance}
             `);

      if (searchPetTypes !== undefined) {
        query.append(` AND (`);
        for (let i = 0; i < searchPetTypes.length; i++) {
          //build sql query for pet types
          if (i == searchPetTypes.length - 1)
            query.append(SQL` Pet.type_id = ${searchPetTypes[i]}`);
          else query.append(SQL` Pet.type_id = ${searchPetTypes[i]} OR `);
        }
        query.append(`)`);
      }

      if (searchPetAges !== undefined) {
        query.append(` AND (`);
        for (let i = 0; i < searchPetAges.length; i++) {
          //build sql query for pet types
          if (i == searchPetAges.length - 1)
            query.append(SQL`Pet.age_id = ${searchPetAges[i]}`);
          else query.append(SQL`Pet.age_id = ${searchPetAges[i]} OR `);
        }
        query.append(`)`);
      }
      if (searchPetSizes !== undefined) {
        query.append(SQL` AND (`);
        for (let i = 0; i < searchPetSizes.length; i++) {
          //build sql query for pet types
          if (i == searchPetSizes.length - 1)
            query.append(SQL`Pet.size_id = ${searchPetSizes[i]}`);
          else query.append(SQL`Pet.size_id = ${searchPetSizes[i]} OR `);
        }
        query.append(`)`);
      }

      if (searchPetColors !== undefined) {
        query.append(
          SQL` AND Pet.pet_id IN (SELECT PetColor.pet_id FROM PetColor WHERE PetColor.color_id IN (`
        );
        for (let i = 0; i < searchPetColors.length; i++) {
          //build sql query for pet types
          if (i == searchPetColors.length - 1)
            query.append(SQL`${searchPetColors[i]}`);
          else query.append(SQL`${searchPetColors[i]},`);
        }
        query.append(`))`);
      }

      if (searchDogBreeds !== undefined) {
        query.append(
          ` AND Dog.dog_id IN (SELECT DogBreeds.dog_id FROM DogBreeds WHERE DogBreeds.breed_id IN (`
        );
        for (let i = 0; i < searchDogBreeds.length; i++) {
          //build sql query for pet types
          if (i == searchDogBreeds.length - 1)
            query.append(SQL`${searchDogBreeds[i]}`);
          else query.append(SQL`${searchDogBreeds[i]},`);
        }
        query.append(SQL`))`); //allows other pet filters to still apply
      }

      if (searchCatBreeds !== undefined) {
        query.append(
          SQL` AND Cat.cat_id IN (SELECT CatBreeds.cat_id FROM CatBreeds WHERE CatBreeds.breed_id IN (`
        );
        for (let i = 0; i < searchCatBreeds.length; i++) {
          //build sql query for pet types
          if (i == searchCatBreeds.length - 1)
            query.append(SQL`${searchCatBreeds[i]}`);
          else query.append(SQL`${searchCatBreeds[i]},`);
        }
        query.append(SQL`))`);
      }

      query.append(SQL` 
            LIMIT 10                       
            OFFSET ${(searchPage - 1) * 10}`);
      //console.log(query);
    } else {
      query.append(SQL`SELECT *,
            (3959 * acos(cos(radians(${searchLatitude}))* cos(radians(Address.latitude))* cos(radians(Address.longitude) - radians(${searchLongitude})) + sin(radians(${searchLatitude})) * sin(radians(Address.latitude)))) as distance
            FROM Pet
            LEFT JOIN Profile ON Profile.pet_id = Pet.pet_id
            LEFT JOIN Address ON Address.reg_user_id = Pet.reg_user_id
            HAVING LOWER(name) LIKE ${name}
            AND distance <  ${searchDistance}
            LIMIT 10 
            OFFSET ${(searchPage - 1) * 10}`);
      //console.log(query)
    }

    connection.query(query, function (err, results) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        requestedSearchResults = results;
        console.log(requestedSearchResults);
        res.status(200).json(requestedSearchResults);
      }
    });
  } else if (searchCategory == "Businesses") {
    //console.log("Category == Businesses")
    //console.log("Given Biz Categories: ", searchBizCategories);
    //console.log(typeof searchBizCategories);

    const query = SQL``;

    if (searchBizCategories && searchBizCategories[0] !== "undefined") {
      query.append(
        SQL`SELECT *, COUNT(*) OVER () as results_count, (3959 * acos(cos(radians(${searchLatitude}))* cos(radians(Address.latitude))* cos(radians(Address.longitude) - radians(${searchLongitude})) + sin(radians(${searchLatitude})) * sin(radians(Address.latitude)))) as distance 
        FROM Business 
        LEFT JOIN Commerce ON Business.business_id = Commerce.business_id 
        LEFT JOIN Shelter ON Business.business_id = Shelter.business_id 
        LEFT JOIN Address ON Business.reg_user_id = Address.reg_user_id 
        JOIN RegisteredUser ON Business.reg_user_id = RegisteredUser.reg_user_id 
        JOIN Account ON RegisteredUser.user_id = Account.user_id 
        LEFT JOIN Profile ON Account.account_id = Profile.account_id 
        HAVING Shelter.business_id IS NULL  
        AND LOWER(name) LIKE ${name}
        AND distance <  ${searchDistance} 
        AND Profile.pet_id IS NULL  
        AND (`
      );
      for (let i = 0; i < searchBizCategories.length; i++) {
        //build sql query with filters
        //console.log("Given Biz Categories [", i,"]: " , searchBizCategories[i]);
        //console.log(typeof searchBizCategories[i]);
        if (i == searchBizCategories.length - 1)
          query.append(
            SQL`Commerce.business_type_id = ${searchBizCategories[i]}`
          );
        else
          query.append(
            SQL`Commerce.business_type_id = ${searchBizCategories[i]} OR `
          );
      }
      //make sure to start from selected page and limit results
      query.append(SQL`) 
            LIMIT 10                       
            OFFSET ${(searchPage - 1) * 10};`);
    } else {
      query.append(
        SQL`SELECT *,COUNT(*) OVER () as results_count, (3959 * acos(cos(radians(${searchLatitude}))* cos(radians(Address.latitude))* cos(radians(Address.longitude) - radians(${searchLongitude})) + sin(radians(${searchLatitude})) * sin(radians(Address.latitude)))) as distance 
        FROM Business 
        LEFT JOIN Shelter ON Business.business_id = Shelter.business_id 
        LEFT JOIN Address ON Business.reg_user_id = Address.reg_user_id 
        JOIN RegisteredUser ON Business.reg_user_id = RegisteredUser.reg_user_id 
        JOIN Account ON RegisteredUser.user_id = Account.user_id 
        LEFT JOIN Profile ON Account.account_id = Profile.account_id 
        HAVING Shelter.business_id IS NULL AND LOWER(name) LIKE ${name} 
        AND distance <  ${searchDistance} 
        AND Profile.pet_id IS NULL 
        LIMIT 10 
        OFFSET ${(searchPage - 1) * 10}`
      );
    }
    console.log("Query: ", query);

    connection.query(query, function (err, results) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        requestedSearchResults = results;
        console.log("Business Search Results", requestedSearchResults);
        res.status(200).json(requestedSearchResults);
      }
    });
  } else if (searchCategory == "Shelters") {
    //console.log('search pet types: ', searchPetTypes)
    const query = SQL``;

    if (searchPetTypes && searchPetTypes[0] !== "undefined") {
      query.append(SQL`SELECT *,COUNT(*) OVER () as results_count,
            (3959 * acos(cos(radians(${searchLatitude}))* cos(radians(Address.latitude))* cos(radians(Address.longitude) - radians(${searchLongitude})) + sin(radians(${searchLatitude})) * sin(radians(Address.latitude)))) as distance
            FROM Business
            JOIN Shelter ON Business.business_id = Shelter.business_id
            LEFT JOIN Address ON Business.reg_user_id = Address.reg_user_id
            JOIN RegisteredUser ON Business.reg_user_id = RegisteredUser.reg_user_id
            JOIN Account ON RegisteredUser.user_id = Account.user_id
            LEFT JOIN Profile ON Account.account_id = Profile.account_id
            HAVING LOWER(name) LIKE ${name}
            AND distance <  ${searchDistance}
            `);

      query.append(" AND Shelter.shelter_id IN");
      query.append(SQL`
                (SELECT ShelterTypes.shelter_id 
                FROM ShelterTypes 
                WHERE ShelterTypes.type_id IN (`);
      for (let i = 0; i < searchPetTypes.length; i++) {
        //build sql query for pet types
        if (i == searchPetTypes.length - 1)
          query.append(SQL`${searchPetTypes[i]}`);
        else query.append(SQL`${searchPetTypes[i]},`);
      }
      query.append(SQL`))
            AND Profile.pet_id IS NULL 
            LIMIT 10                       
            OFFSET ${(searchPage - 1) * 10}`);
      //console.log(query);
    } else {
      query.append(SQL`SELECT *,COUNT(*) OVER () as results_count,
            (3959 * acos(cos(radians(${searchLatitude}))* cos(radians(Address.latitude))* cos(radians(Address.longitude) - radians(${searchLongitude})) + sin(radians(${searchLatitude})) * sin(radians(Address.latitude)))) as distance
            FROM Business
            JOIN Shelter ON Business.business_id = Shelter.business_id
            LEFT JOIN Address ON Business.reg_user_id = Address.reg_user_id
            JOIN RegisteredUser ON Business.reg_user_id = RegisteredUser.reg_user_id
            JOIN Account ON RegisteredUser.user_id = Account.user_id
            LEFT JOIN Profile ON Account.account_id = Profile.account_id
            HAVING LOWER(name) LIKE ${name}
            AND distance <  ${searchDistance}
            AND Profile.pet_id IS NULL
            LIMIT 10 
            OFFSET ${(searchPage - 1) * 10}`);
      //console.log(query);
    }
    connection.query(query, function (err, results) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        requestedSearchResults = results;
        console.log("Shelter Search Results", requestedSearchResults);
        res.status(200).json(requestedSearchResults);
      }
    });
  } else if (searchCategory == "Pet Owners") {
    if (name != "") {
      console.log(name);
      //console.log('searching through RegisteredPetOwner')
      connection.query(
        `SELECT *, COUNT(*) OVER () as results_count
            FROM Profile
            JOIN Account ON Profile.account_id = Account.account_id
            JOIN RegisteredUser ON Account.user_id = RegisteredUser.user_id
            LEFT JOIN Business ON RegisteredUser.reg_user_id = Business.reg_user_id
            JOIN Credentials ON Account.account_id = Credentials.acct_id
            WHERE Business.business_id IS NULL 
            AND Profile.pet_id IS NULL
            AND ((LOWER(Profile.display_name) LIKE ?) OR (LOWER(Credentials.username) LIKE ?))
            `,
        [name, name],
        function (err, results) {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          } else {
            requestedSearchResults = results;
            console.log("Pet Owner Results: ", requestedSearchResults);
            res.status(200).json(requestedSearchResults);
          }
        }
      );
    } else {
      //if the user didn't type anything then don't return anything because there is no proximity tracking
      return [];
    }
  }
});

module.exports = router;
