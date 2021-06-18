const express = require("express");
const router = express.Router();

const connection = require("../db");

router.post("/api/logout", (req, res) => {
  //console.log("/api/logout")
  req.session.destroy((err) => {
    if (err) {
      //console.log(err);
    }
  });
  res.clearCookie("userId");
  res.send({ loggedIn: false });
});

module.exports = router;
