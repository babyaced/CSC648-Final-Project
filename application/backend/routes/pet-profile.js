const express = require("express");
const connection = require("../db");
const router = express.Router();

router.post("/api/create-pet-profile", (req, res) => {
  console.log("POST /api/create-pet-profile");
  console.log(req.body);
  const { name, petType, age, color, size, dogBreed, catBreed } = req.body;

  let insertedPet;

  //MAKE THIS INTO A TRANSACTION LATER
  connection.getConnection(function (err, conn) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    conn.beginTransaction(async function (err) {
      if (err) {
        return res.status(500).json(err);
      } else {
        try {
          const [insertedPet, _] = await connection.promise().query(
            `INSERT INTO Pet
                 (age_id, size_id, reg_user_id, name, type_id)
                 VALUES (?,?,?,?,?)`,
            [
              age.value,
              size.value,
              req.session.reg_user_id,
              name,
              petType.value,
            ]
          );
          console.log("insertedPet: ", insertedPet);

          console.log("insertedPet.insertId: ", insertedPet.insertId);

          const insertedProfile = await connection.promise().query(
            `INSERT INTO Profile
                        (display_name,about_me, account_id, pet_id, type)
                        VALUES (?, ?, 
                        (SELECT Account.account_id
                          FROM Account
                          JOIN RegisteredUser ON RegisteredUser.reg_user_id = ?
                          WHERE Account.user_id = RegisteredUser.user_id),
                        ?,
                        'Pet')`,
            [name, "", req.session.reg_user_id, insertedPet.insertId]
          );
          console.log("insertedProfile: ", insertedProfile);

          for (let i = 0; i < req.body.color.length; i++) {
            const insertedColor = await connection
              .promise()
              .query(`INSERT INTO PetColor (pet_id,color_id) VALUES (?,?)`, [
                insertedPet.insertId,
                req.body.color[i].value,
              ]);

            console.log("insertedColor: ", insertedColor);
          }
          if (dogBreed.length !== 0 && petType.label == "Dog") {
            const insertedDog = await connection
              .promise()
              .query(`INSERT INTO Dog (pet_id) VALUES (?)`, [
                insertedPet.insertId,
              ]);
            console.log("insertedDog: ", insertedDog);
            for (let i = 0; i < dogBreed.length; i++) {
              const insertedDogBreed = await connection
                .promise()
                .query(
                  `INSERT INTO DogBreeds (dog_id, breed_id) VALUES (?,?)`,
                  [insertedDog.insertId, dogBreed[i].value]
                );
              console.log("insertedDogBreed: ", insertedDogBreed);
            }
            conn.commit(function (err) {
              if (err) {
                return conn.rollback(function () {
                  console.error(err);
                  return res.status(500).json(err);
                });
              }
              console.log("success!");
              return res.status(200).json({ data: insertedProfile.insertId });
            });
          } else if (catBreed.length !== 0 && petType.label == "Cat") {
            const insertedCat = await connection
              .promise()
              .query(`INSERT INTO Cat (pet_id) VALUES (?)`, [
                insertedPet.insertId,
              ]);
            console.log("insertedCat: ", insertedCat);
            for (let i = 0; i < catBreed.length; i++) {
              const insertedCatBreed = await connection
                .promise()
                .query(
                  `INSERT INTO CatBreeds (cat_id, breed_id) VALUES (?,?)`,
                  [insertedCat.insertId, catBreed[i].value]
                );
              console.log("insertedCatBreed: ", insertedCatBreed);
            }
            conn.commit(function (err) {
              if (err) {
                return conn.rollback(function () {
                  console.error(err);
                  return res.status(500).json(err);
                });
              }
              console.log("success!");
              return res.status(200).json({ data: insertedProfile.insertId });
            });
          } else {
            conn.commit(function (err) {
              if (err) {
                return conn.rollback(function () {
                  console.error(err);
                  return res.status(500).json(err);
                });
              }
              console.log("success!");
              return res.status(200).json({
                display_name: name,
                profile_id: insertedProfile.insertId,
                profile_pic_link:
                  "https://csc648groupproject.s3-us-west-2.amazonaws.com/DefaultProfilePic.svg",
              });
            });
          }
        } catch (err) {
          console.error(err);
          return conn.rollback(function () {
            return res.status(500).json(err);
          });
        }
      }
    });
  });
});

router.get("/api/pet-details", (req, res) => {
  console.log("GET /api/pet-details");
  console.log(req.query);
  const {
    petID,
    typeOptions,
    colorOptions,
    ageOptions,
    sizeOptions,
    dogBreedOptions,
    catBreedOptions,
  } = req.query;
  console.log(Array.isArray(typeOptions));
  console.log(Array.isArray(colorOptions));
  console.log(Array.isArray(ageOptions));
  console.log(Array.isArray(sizeOptions));
  console.log(Array.isArray(dogBreedOptions));
  console.log(Array.isArray(catBreedOptions));
  console.log("petID: ", petID);
  connection.query(
    `
        SELECT PetType.pet_type_name, Size.size_name, Age.age_name,GROUP_CONCAT(Color.color_name SEPARATOR ',') AS Colors, GROUP_CONCAT(DogBreed.dog_breed_name SEPARATOR ',') AS BreedsOfDog,GROUP_CONCAT(CatBreed.cat_breed_name SEPARATOR ',') AS BreedsOfCat
        FROM Pet
        JOIN PetType ON PetType.pet_type_id = Pet.type_id
        JOIN Size ON Size.size_id = Pet.size_id
        JOIN Age ON Age.age_id = Pet.age_id
        JOIN PetColor ON Pet.pet_id = PetColor.pet_id
        JOIN Color ON Color.color_id = PetColor.color_id
        LEFT JOIN Dog ON Dog.pet_id = Pet.pet_id
        LEFT JOIN DogBreeds ON Dog.dog_id = DogBreeds.dog_id
        LEFT JOIN DogBreed ON DogBreeds.breed_id = DogBreed.dog_breed_id
        LEFT JOIN Cat ON Cat.pet_id = Pet.pet_id
        LEFT JOIN CatBreeds ON Cat.cat_id = CatBreeds.cat_id
        LEFT JOIN CatBreed ON CatBreeds.breed_id = CatBreed.cat_breed_id
        WHERE Pet.pet_id = ?`,
    [petID],
    function (err, result) {
      if (err) {
        console.error(err);
      } else {
        console.log(result);

        let age;
        if (ageOptions && result[0]) {
          age = ageOptions.find(
            (ageOption) => JSON.parse(ageOption).label === result[0].age_name
          );
        }

        let type;
        if (typeOptions && result[0]) {
          type = typeOptions.find(
            (typeOption) =>
              JSON.parse(typeOption).label === result[0].pet_type_name
          );
        }

        let size;
        if (sizeOptions && result[0]) {
          size = sizeOptions.find(
            (sizeOption) => JSON.parse(sizeOption).label === result[0].size_name
          );
        }

        let colorSelectOptions = [];
        if (colorOptions && result[0].Colors) {
          let colors = result[0].Colors.split(",");
          colors = [...new Set(colors)];

          for (let i = 0; i < colors.length; i++) {
            colorOption = colorOptions.find(
              (colorOption) => JSON.parse(colorOption).label === colors[i]
            );
            colorSelectOptions.push(colorOption);
          }
          console.log(colorSelectOptions);
        }

        let catBreedSelectOptions = [];
        if (catBreedOptions && result[0].BreedsOfCat) {
          let catBreeds = result[0].BreedsOfCat.split(",");
          catBreeds = [...new Set(catBreeds)];
          for (let i = 0; i < catBreeds.length; i++) {
            catBreedOption = catBreedOptions.find(
              (catBreedOption) =>
                JSON.parse(catBreedOption).label === catBreeds[i]
            );
            catBreedSelectOptions.push(catBreedOption);
          }
          console.log(catBreedSelectOptions);
        }

        let dogBreedSelectOptions = [];
        if (dogBreedOptions && result[0].BreedsOfDog) {
          let dogBreeds = result[0].BreedsOfDog.split(",");
          dogBreeds = [...new Set(dogBreeds)];

          for (let i = 0; i < dogBreeds.length; i++) {
            dogBreedOption = dogBreedOptions.find(
              (dogBreedOption) =>
                JSON.parse(dogBreedOption).label === dogBreeds[i]
            );
            dogBreedSelectOptions.push(dogBreedOption);
          }
          console.log(dogBreedSelectOptions);
        }

        res.status(200).json({
          petType: type,
          petAge: age,
          petSize: size,
          petColors: colorSelectOptions,
          dogBreeds: dogBreedSelectOptions,
          catBreeds: catBreedSelectOptions,
        });
      }
    }
  );
});

router.post("/api/pet-details", (req, res) => {
  console.log("POST /api/pet-details");
  const {
    petProfileID,
    newName,
    newPetType,
    newAge,
    newSize,
    newColors,
    newDogBreeds,
    newCatBreeds,
  } = req.body;

  console.log("req.body:", req.body);

  //first check if the logged in user is the owner
  connection.getConnection(function (err, conn) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    conn.beginTransaction(async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      console.log(newName, petProfileID, req.session.reg_user_id);
      try {
        const updatedProfile = await conn.promise().query(
          `
            UPDATE Profile
            JOIN Pet ON Profile.pet_id = Pet.pet_id
            SET Profile.display_name = ?
            WHERE Profile.profile_id = ?
            AND Pet.reg_user_id = ?`,
          [newName, petProfileID, req.session.reg_user_id]
        );
        console.log("updatedProfile", updatedProfile);

        console.log(
          newPetType.value,
          newAge.value,
          newSize.value,
          petProfileID,
          req.session.reg_user_id
        );

        const [result, _] = await conn.promise().query(
          `SELECT Pet.type_id 
            FROM Pet
            WHERE Pet.pet_id = (
              SELECT Profile.pet_id
              FROM Profile
              JOIN Pet ON Profile.pet_id = Pet.pet_id
              WHERE Profile.profile_id = ?
              AND Pet.reg_user_id = ?)`,
          [petProfileID, req.session.reg_user_id]
        );

        let currentPetType = result[0].type_id;
        console.log("currentPetType", currentPetType);

        const updatedPet = await conn.promise().query(
          `
          UPDATE Pet
          JOIN Profile ON Profile.pet_id = Pet.pet_id
          SET Pet.type_id = ?, Pet.age_id = ?, Pet.size_id = ?
          WHERE Profile.profile_id = ?
          AND Pet.reg_user_id = ?`,
          [
            newPetType.value,
            newAge.value,
            newSize.value,
            petProfileID,
            req.session.reg_user_id,
          ]
        );

        console.log("updatedPet: ", updatedPet);

        const deletedColors = await conn.promise().query(
          `
            DELETE FROM PetColor
            WHERE PetColor.pet_id = (
            SELECT Pet.pet_id
            FROM Pet
            JOIN Profile ON Profile.pet_id = Pet.pet_id
            WHERE Profile.profile_id = ?
        )`,
          [petProfileID]
        );
        console.log("deletedColors", deletedColors);

        for (i = 0; i < newColors.length; i++) {
          const insertedColor = await conn.promise().query(
            `
          INSERT INTO PetColor (pet_id, color_id) VALUES ((
            SELECT Pet.pet_id
            FROM Pet
            JOIN Profile ON Profile.pet_id = Pet.pet_id
            WHERE Profile.profile_id = ?
          ),?)`,
            [petProfileID, newColors[i].value]
          );

          console.log("insertedColor", insertedColor);
        }

        const deletedDogBreeds = await conn.promise().query(
          `
            DELETE FROM DogBreeds
            WHERE DogBreeds.dog_id = (
              SELECT Dog.dog_id
              FROM Dog
              JOIN Profile ON Profile.pet_id = Dog.pet_id
              WHERE Profile.profile_id = ?
          )`,
          [petProfileID]
        );

        console.log("deletedDogBreeds", deletedDogBreeds);

        const deletedCatBreeds = await conn.promise().query(
          `
          DELETE FROM CatBreeds
          WHERE CatBreeds.cat_id = (
            SELECT Cat.cat_id
            FROM Cat
            JOIN Profile ON Profile.pet_id = Cat.pet_id
            WHERE Profile.profile_id = ?
          )`,
          [petProfileID]
        );

        console.log("deletedCatBreeds", deletedCatBreeds);
        console.log(newPetType.label);
        if (newPetType.label === "Dog") {
          if (currentPetType === 2) {
            console.log("deleting cat");
            const deletedCat = await conn.promise().query(
              `
              DELETE FROM Cat
              WHERE Cat.pet_id = (
                SELECT Profile.pet_id
                FROM Profile
                JOIN Pet ON Profile.pet_id = Pet.pet_id
                WHERE Profile.profile_id = ?
                AND Pet.reg_user_id = ?
              )
            `,
              [petProfileID, req.session.reg_user_id]
            );
          }
          console.log("newPetType.label", newPetType.label);

          if (currentPetType !== 1) {
            const insertedDog = await conn.promise().query(
              `INSERT INTO Dog (pet_id) VALUES (
                SELECT Pet.pet_id
                FROM Pet
                JOIN Profile ON Profile.pet_id = Pet.pet_id
                WHERE Profile.profile_id = ?
                AND Pet.reg_user_id = ?
              )`,
              [petProfileID, req.session.reg_user_id]
            );
            console.log("insertedDog", insertedDog);
          }

          for (i = 0; i < newDogBreeds.length; i++) {
            console.log("inserting dog breeds");
            const insertedDogBreed = await conn.promise().query(
              `
                INSERT INTO DogBreeds (dog_id, breed_id) VALUES ((
                  SELECT Dog.dog_id
                  FROM Dog
                  JOIN Profile ON Profile.pet_id = Dog.pet_id
                  WHERE Profile.profile_id = ?
                ),?)`,
              [petProfileID, newDogBreeds[i].value]
            );
            console.log("insertedDogBreed", insertedDogBreed);
          }
          conn.commit(function (err) {
            if (err) {
              return conn.rollback(function () {
                console.log(err);
              });
            }
            console.log("success!");
            return res.status(200).json("success");
          });
        } else if (newPetType.label === "Cat") {
          if (currentPetType == 1) {
            console.log("deleting dog");
            const deletedDog = await conn.promise().query(
              `
              DELETE FROM Dog
              WHERE Dog.pet_id = (
                SELECT Profile.pet_id
                FROM Profile
                JOIN Pet ON Profile.pet_id = Pet.pet_id
                WHERE Profile.profile_id = ?
                AND Pet.reg_user_id = ?
              )`,
              [petProfileID, req.session.reg_user_id]
            );
          }

          console.log(newPetType.label);

          if (currentPetType !== 2) {
            const insertedCat = await conn.promise().query(
              `INSERT INTO Cat (pet_id) VALUES ((
            SELECT Pet.pet_id
            FROM Pet
            JOIN Profile ON Profile.pet_id = Pet.pet_id
            WHERE Profile.profile_id = ?
            AND Pet.reg_user_id = ?)
          )`,
              [petProfileID, req.session.reg_user_id]
            );
            console.log("insertedCat", insertedCat);
          }
          for (i = 0; i < newCatBreeds.length; i++) {
            const insertedCatBreed = await conn.promise().query(
              `
            INSERT INTO CatBreeds (cat_id, breed_id) VALUES ((
              SELECT Cat.cat_id
              FROM Cat
              JOIN Profile ON Profile.pet_id = Cat.pet_id
              WHERE Profile.profile_id = ?
            ),?)`,
              [petProfileID, newCatBreeds[i].value]
            );
            console.log("insertedCatBreed", insertedCatBreed);
          }
          conn.commit(function (err) {
            if (err) {
              return conn.rollback(function () {
                console.log(err);
              });
            }
            console.log("success!");
            return res.status(200).json("success");
          });
        } else {
          console.log(newPetType.label);
          const deletedDog = await conn.promise().query(
            `
              DELETE FROM Dog
              WHERE Dog.pet_id = (
                SELECT Profile.pet_id
                FROM Profile
                JOIN Pet ON Profile.pet_id = Pet.pet_id
                WHERE Profile.profile_id = ?
                AND Pet.reg_user_id = ?
              )`,
            [petProfileID, req.session.reg_user_id]
          );

          const deletedCat = await conn.promise().query(
            `
              DELETE FROM Cat
              WHERE Cat.pet_id = (
                SELECT Profile.pet_id
                FROM Profile
                JOIN Pet ON Profile.pet_id = Pet.pet_id
                WHERE Profile.profile_id = ?
                AND Pet.reg_user_id = ?
              )
            `,
            [petProfileID, req.session.reg_user_id]
          );

          console.log("deletedCat", deletedCat);

          console.log("deletedDog", deletedDog);
          conn.commit(function (err) {
            if (err) {
              return conn.rollback(function () {
                console.error(err);
                return res.status(500).json(err);
              });
            }
            console.log("success!");
            return res.status(200).json("success");
          });
        }
      } catch (err) {
        console.error(err);
        return conn.rollback(function () {
          console.error(err);
          return res.status(500).json(err);
        });
      }
    });
  });
});

router.get("/api/tagged-posts", (req, res) => {
  console.log("GET /api/tagged-posts");

  connection.query(
    `SELECT * 
        FROM Photo
        LEFT JOIN Post ON Photo.post_id = Post.post_id
        JOIN RegisteredUser ON RegisteredUser.reg_user_id = Post.reg_user_id
        JOIN Account ON RegisteredUser.user_id = Account.user_id
        JOIN Profile ON Account.account_id = Profile.account_id
        WHERE Profile.profile_id = ${req.query.profileID}
        AND Photo.post_id 
        IN (SELECT PostTag.post_id
         FROM PostTag 
         WHERE PostTag.pet_id = Profile.pet_id)`,
    function (err, taggedPosts) {
      if (err) {
        console.log(err);
      } else {
        console.log("taggedPosts", taggedPosts);
        res.status(200).json(taggedPosts);
      }
    }
  );
});

module.exports = router;

// function (err, result) {
//   if (err) {
//     return conn.rollback(function () {
//       res.status(500).json(err);
//     });
//   } else {
//     console.log("display name updated");
//     conn.query(
//       `
//       UPDATE Pet
//       SET Pet.type_id = ?, Pet.age_id = ?, Pet.size_id = ?
//       JOIN Profile ON Profile.pet_id = Pet.pet_id
//       WHERE Profile.profile_id = ?
//       AND Pet.reg_user_id = ?`,
//       [
//         newType.value,
//         newAge.value,
//         newSize.value,
//         petProfileID,
//         req.session.reg_user_id,
//       ],
//       function (err, result) {
//         if (err) {
//           return conn.rollback(function () {
//             res.status(500).json(err);
//           });
//         } else {
//           conn.query(
//             `
//                 DELETE FROM Dog
//                 WHERE Dog.pet_id = (
//                   SELECT Profile.pet_id
//                   FROM Profile
//                   WHERE Profile.profile_id = ?
//                   AND Pet.reg_user_id = ?
//                 )

//               `,
//             [petProfileID, req.session.reg_user_id],
//             function (err, result) {
//               if (err) {
//                 return conn.rollback(function () {
//                   res.status(500).json(err);
//                 });
//               } else {
//                 conn.query(
//                   `
//                       DELETE FROM Cat
//                       WHERE Cat.pet_id = (
//                         SELECT Profile.pet_id
//                         FROM Profile
//                         WHERE Profile.profile_id = ?
//                         AND Pet.reg_user_id = ?
//                       )
//                     `,
//                   [petProfileID, req.session.reg_user_id],
//                   function (err, result) {
//                     if (err) {
//                       return conn.rollback(function () {
//                         res.status(500).json(err);
//                       });
//                     } else {
//                       conn.query(
//                         `
//                     DELETE FROM PetColor
//                     WHERE PetColor.pet_id = (
//                       SELECT Pet.pet_id
//                       FROM Pet
//                       JOIN Profile ON Profile.pet_id = Pet.pet_id
//                       WHERE Profile.profile_id = ?
//                     )`,
//                         [petProfileID],
//                         function (err, result) {
//                           if (err) {
//                             return conn.rollback(function () {
//                               res.status(500).json(err);
//                             });
//                           } else {
//                             let i;
//                             for (i = 0; i < newColors.length; i++) {
//                               conn.query(
//                                 `
//                             INSERT INTO PetColor (pet_id, color_id) VALUES ((
//                               SELECT Pet.pet_id
//                               FROM Pet
//                               JOIN Profile ON Profile.pet_id = Pet.pet_id
//                               WHERE Profile.profile_id = ?
//                             ),?)`,
//                                 [petProfileID, newColors[i].value],
//                                 function (err, result) {
//                                   if (err) {
//                                     return conn.rollback(function () {
//                                       res.status(500).json(err);
//                                     });
//                                   } else {
//                                     console.log(
//                                       "inserted ",
//                                       newColors[i]
//                                     );
//                                   }
//                                 }
//                               );
//                             }
//                           }
//                         }
//                       );
//                     }
//                   }
//                 );
//               }
//             }
//           );

//           conn.query(
//             `
//             DELETE FROM DogBreeds
//             WHERE DogBreed.dog_id = (
//               SELECT Dog.dog_id
//               FROM Dog
//               JOIN Profile ON Profile.pet_id = Dog.pet_id
//               WHERE Profile.profile_id = ?
//             )`,
//             [petProfileID],
//             function (err, result) {
//               if (err) {
//                 return conn.rollback(function () {
//                   res.status(500).json(err);
//                 });
//               } else {
//                 if ((newPetType.label = "Dog")) {
//                   conn.query(
//                     `INSERT INTO Dog (pet_id) VALUES (
//                       SELECT Pet.pet_id
//                       FROM Pet
//                       JOIN Profile ON Profile.pet_id = Pet.pet_id
//                       WHERE Profile.profile_id = ?
//                       AND Pet.reg_user_id = ?
//                     )`,
//                     [petProfileID, req.session.reg_user_id],
//                     function (err, result) {
//                       if (err) {
//                         return conn.rollback(function () {
//                           res.status(500).json(err);
//                         });
//                       } else {
//                         for (i = 0; i < newDogBreeds.length; i++) {
//                           conn.query(
//                             `
//                           INSERT INTO DogBreeds (dog_id, breed_id) VALUES ((
//                             SELECT Dog.dog_id
//                             FROM Dog
//                             JOIN Profile ON Profile.pet_id = Dog.pet_id
//                             WHERE Profile.profile_id = ?
//                           ),?)`,
//                             [petProfileID, newDogBreeds[i].value],
//                             function (err, result) {
//                               if (err) {
//                                 return conn.rollback(function () {
//                                   res.status(500).json(err);
//                                 });
//                               }
//                             }
//                           );
//                         }
//                       }
//                     }
//                   );
//                 }
//               }
//             }
//           );
//           conn.query(
//             `
//             DELETE FROM CatBreeds
//             WHERE CatBreed.cat_id = (
//               SELECT Cat.cat_id
//               FROM Cat
//               JOIN Profile ON Profile.pet_id = Cat.pet_id
//               WHERE Profile.profile_id = ?
//             )`,
//             [petProfileID],
//             function (err, result) {
//               if (err) {
//                 return conn.rollback(function () {
//                   res.status(500).json(err);
//                 });
//               } else {
//                 if ((newPetType.label = "Cat")) {
//                   for (i = 0; i < newCatBreeds.length; i++) {
//                     conn.query(
//                       `
//                       INSERT INTO CatBreeds (cat_id, breed_id) VALUES ((
//                         SELECT Cat.cat_id
//                         FROM Cat
//                         JOIN Profile ON Profile.pet_id = Cat.pet_id
//                         WHERE Profile.profile_id = ?
//                       ),?)`,
//                       [petProfileID, newCatBreeds[i].value],
//                       function (err, result) {
//                         if (err) {
//                           return conn.rollback(function () {
//                             res.status(500).json(err);
//                           });
//                         }
//                       }
//                     );
//                   }
//                 }
//               }
//             }
//           );
//         }
//       }
//     );
//   }
// }
// );
// });
// conn.commit(function (err) {
// if (err) {
// return conn.rollback(function () {
//   console.log(err);
// });
// }
// console.log("success!");
// res.status(200).json("success");
