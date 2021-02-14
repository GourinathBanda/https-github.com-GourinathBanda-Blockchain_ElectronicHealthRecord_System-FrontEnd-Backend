const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");
// var Notifications = require("../schemas/notificationSchema");
var Permissions = require("../schemas/permissionSchema");
var authenticate = require("../authenticate");

const permissionRouter = express.Router();

permissionRouter.use(bodyParser.json());

permissionRouter
  .route("/")
  .get(cors(), authenticate.verifyUser, (req, res, next) => {
    Permissions.findOne({ user: req.user._id })
      .populate("user")
      .populate("products")
      .exec((err, notif) => {
        if (err) return next(err);
        if (notif == null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({});
          return;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(notif.products);
      });
  })

  .post(cors(), authenticate.verifyUser, (req, res, next) => {
    Permissions.findOne({ user: req.user._id }, (err, notif) => {
      if (err) {
        return next(err);
      }
      if (notif != null) {
        if (notif.products.indexOf(req.body._id) !== -1) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(notif.products);
        } else {
          notif.products.push(req.body._id);
          notif
            .save()
            .then((notif) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(notif.products);
            })
            .catch((err) => next(err));
        }
      } else {
        Permissions.create({
          // create new
          user: req.user._id,
          products: req.body._id,
        })
          .then(
            (notif) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(notif);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      }
    });
  })

  .put(cors(), authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.send("not supported ");
  })

  .delete(cors(), authenticate.verifyUser, (req, res, next) => {
    Permissions.findOne({ user: req.user._id }, (err, notif) => {
      if (err) {
        return next(err);
      }
      if (notif != null) {
        notif.products = notif.products.filter((id) => id != req.body._id);
        notif
          .save()
          .then(
            (notif) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(notif.products);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      }
    });
  });

module.exports = permissionRouter;
