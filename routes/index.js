var express = require("express");
var router = express.Router();
var cors = require("cors");
var ipfsUpload = require("../ipfsupload");

router.get("/", cors(), function (req, res, next) {
  ipfsUpload.ipfsUpload();
  res.json({ title: "Express Server" });
});

module.exports = router;
