var express = require("express");
var router = express.Router();
var cors = require("cors");
var authenticate = require("../authenticate");

router.get("/", cors(), authenticate.verifyUser, function (req, res, next) {
  res.json({ title: "Express Server" });
});

module.exports = router;
