const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
var cors = require("cors");
var User = require("../schemas/userSchema");
var authenticate = require("../authenticate");
var authController = require("../auth");

var usersRouter = express.Router();

usersRouter.use(bodyParser.json());

usersRouter.post(
  "/register",
  cors(),
  authController.register,
  passport.authenticate("local", { session: false }),
  function (req, res, next) {
    return res.status(200).send("Successfully created new account");
  }
);

usersRouter
  .route("/user")
  .options(cors(), (req, res) => {
    res.senStatus(200);
  })
  .get(cors(), authenticate.verifyUser, function (req, res, next) {
    User.findById(req.user._id)
      .then(
        (user) => {
          console.log(user);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => console.log(err));
  })
  .put(cors(), function (req, res, next) {
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
      .then(
        (user) => {
          console.log(user);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((e) => console.log(e));
  });

usersRouter.get(
  "/checkexists/:username",
  cors(),
  authenticate.verifyUser,
  function (req, res, next) {
    User.findOne({ username: req.params.username }).then(
      (user) => {
        if (user != null) {
          return res.sendStatus(200);
        }
        res.sendStatus(404);
      },
      (err) => {
        console.log(err.message);
      }
    );
  }
);

usersRouter.post("/login", cors(), function (req, res, next) {
  authController.login(req, res, next);
});

usersRouter.get("/autologin", cors(), function (req, res, next) {
  authController.autologin(req, res, next);
});

usersRouter.get(
  "/logout",
  cors(),
  authenticate.verifyUser,
  function (req, res, next) {
    // authController.logout(req, res, next);
    res.status(200).send("Logout Success");
  }
);

module.exports = usersRouter;
