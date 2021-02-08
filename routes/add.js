var express = require("express");
var router = express.Router();
var cors = require("cors");
var authenticate = require("../authenticate");

router.post(
  "/",
  cors(),
  authenticate.verifyHospital,
  function (req, res, next) {
    if (!req.files) {
      return res.status(500).send({ msg: "file is not found" });
    }
    // accessing the file
    const myFile = req.files.file;

    //  mv() method places the file inside public directory
    myFile.mv(`./uploades/${myFile.name}`, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      return res.status(200);
      // .send({ name: myFile.name, path: `/${myFile.name}` });
    });
  }
);

module.exports = router;
