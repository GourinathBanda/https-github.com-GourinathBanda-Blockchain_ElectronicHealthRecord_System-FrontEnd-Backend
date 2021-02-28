var express = require("express");
var cors = require("cors");
var authenticate = require("../authenticate.js");
var router = express.Router();
const IPFS = require("ipfs");
const node = IPFS.create({ silent: true });

router.post(
  "/",
  cors(),
  authenticate.verifyUser,
  authenticate.verifyHospital,
  async function (req, res, next) {
    if (!req.files) {
      return res.status(500).send({ msg: "file is not found" });
    }
    const file = req.files.file;

    fileSize = file.size;
    var hash = "";

    const updateProgress = (bytesLoaded) => {
      let percent = 100 - (bytesLoaded / fileSize) * 100;
      console.log(percent, "%");
    };

    try {
      const filesAdded = (await node).add(
        {
          path: file.name,
          content: file.tempFilePath,
        },
        { wrapWithDirectory: true, progress: updateProgress }
      );

      hash = (await filesAdded).cid.toString();
      console.log("hash", hash);
      // console.log("filesAdded", filesAdded);
      // return res.status(200).send({ hash: hash });
      // return res.status(200).send();
      return res.json({ hash: hash });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: err.message });
    }
  }
);

module.exports = router;
