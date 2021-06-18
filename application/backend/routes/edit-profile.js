const express = require("express");
const connection = require("../db");
const router = express.Router();

router.post("/api/about-me", (req, res) => {
  const { newAboutMe, profileID } = req.body;
  //may need to change this to support pet profile
  //console.log('newAboutMe: ',newAboutMe);
  //console.log('profileID: ', profileID);
  //console.log("POST /api/edit-about-me")
  connection.query(
    `UPDATE Profile
         SET about_me = ?
         WHERE profile_id = ?`,
    [newAboutMe, profileID],
    function (err, result) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      }
      //console.log(result)
      res.status(200).json(result);
    }
  );
});

router.post("/api/address", (req, res) => {
  const { newAddress, newLatitude, newLongitude } = req.body;
  connection.query(
    `UPDATE Address
         SET address = ?, latitude = ?, longitude = ?
         WHERE Address.reg_user_id= ?`,
    [newAddress, newLatitude, newLongitude, req.session.reg_user_id],
    function (err, result) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      } else {
        //console.log(result);
        res.status(200).json(result);
      }
    }
  );
});

router.post("/api/hours", (req, res) => {
  const {
    newSunOpen,
    newSunClose,
    newMonOpen,
    newMonClose,
    newTueOpen,
    newTueClose,
    newWedOpen,
    newWedClose,
    newThuOpen,
    newThuClose,
    newFriOpen,
    newFriClose,
    newSatOpen,
    newSatClose,
  } = req.body;
  //console.log('newSunOpen' +newSunOpen);

  //console.log(query);
  connection.query(
    `UPDATE HoursOfOperation
    JOIN Business ON HoursOfOperation.business_id = Business.business_id
    SET sun_open=?, sun_close=?,
       mon_open=?, mon_close=?,
       tue_open=?, tue_close=?,
       wed_open=?, wed_close=?,
       thu_open=?, thu_close=?,
       fri_open=?, fri_close=?,
       sat_open=?, sat_close=?
   WHERE Business.reg_user_id = ?`,
    [
      newSunOpen,
      newSunClose,
      newMonOpen,
      newMonClose,
      newTueOpen,
      newTueClose,
      newWedOpen,
      newWedClose,
      newThuOpen,
      newThuClose,
      newFriOpen,
      newFriClose,
      newSatOpen,
      newSatClose,
      req.session.reg_user_id,
    ],
    function (err, result) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      } else {
        //console.log(result);
        res.status(200).json(result);
      }
    }
  );
});

router.post("/api/phone-number", (req, res) => {
  const { newPhoneNumber } = req.body;
  connection.query(
    `UPDATE Business
         SET phone_num= ?
         WHERE Business.reg_user_id = ?`,
    [newPhoneNumber, req.session.reg_user_id],
    function (err, result) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      } else {
        //console.log(result);
        res.status(200).json(result);
      }
    }
  );
});

module.exports = router;
