var express = require("express");
var cors = require("cors");
var authenticate = require("../authenticate.js");

var router = express.Router();

router.post(
  "/",
  cors(),
  authenticate.verifyUser,
  authenticate.verifyHospital,
  function (req, res, next) {
    if (!req.files) {
      return res.status(500).send({ msg: "file is not found" });
    }
    // accessing the file
    const myFile = req.files.file;

    console.log("FILE UPLOADED?");
    //  mv() method places the file inside public directory
    myFile.mv(`./uploades/${myFile.name}`, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      return res.status(200).send("Success");
      // .send({ name: myFile.name, path: `/${myFile.name}` });
    });
  }
);

module.exports = router;
