const User = require("./schemas/userSchema.js");
const bodyParser = require("body-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("./config.js");

exports.register = async (req, res, next) => {
  try {
    const reqUser = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      role: req.body.role,
      aadhar: req.body.aadhar,
      phoneNo: req.body.phoneNo,
    };

    User.register(new User(reqUser), req.body.password, (err, account) => {
      if (err) {
        return res.status(500).send("An error occurred: " + err);
      }
      return next();
    });
  } catch (err) {
    console.log("error occured", err.msg);
    return res.status(500).send("An error occurred: " + err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // console.log(req.body);
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: "Something is not right with your input",
      });
    }
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        const token = jwt.sign(
          { _id: user._id, email: user.email },
          config.SECRET_KEY,
          { expiresIn: 36000 }
        );
        return res.json({
          username: user.username,
          role: user.role,
          scAccountAddress: user.scAccountAddress,
          encryptionKey: user.encryptionKey,
          aadhar: user.aadhar,
          token,
        });
      });
    })(req, res);
  } catch (err) {
    console.log(err);
  }
};

exports.autologin = async (req, res, next) => {
  try {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (user) {
        req.login(user, { session: false }, (err) => {
          // console.log(user);
          if (!err) {
            const token = jwt.sign(
              { _id: user._id, email: user.email },
              config.SECRET_KEY,
              { expiresIn: 36000 }
            );
            return res.json({
              username: user.username,
              role: user.role,
              scAccountAddress: user.scAccountAddress,
              encryptionKey: user.encryptionKey,
              aadhar: user.aadhar,
              token,
            });
          }
        });
      }
    })(req, res);
  } catch (err) {
    console.log(err);
  }
};

// exports.logout = async (req, res, next) => {
//     try {
//         passport.authenticate('jwt', { session: false }, (err, user, info) => {
//             if (user) {
//                 req.login(user, { session: false }, (err) => {
//                     if (!err) {
//                         // add token to the blacklist
//                         return res.status(200).send('Logout Success');
//                     }
//                 });
//             }
//         })(req, res);
//     }
//     catch (err) {
//         console.log(err);
//     }
// };
