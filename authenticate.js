const passport = require("passport");
const User = require("./schemas/userSchema");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const config = require("./config.js");
const roles = require("./roles.js");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    User.authenticate()
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.SECRET_KEY,
  passReqToCallback: true,
};

var strategy = new JWTStrategy(opts, (req, jwtPayload, next) => {
  User.findById(jwtPayload._id)
    .then((user) => {
      if (user) {
        req.user = user;
        next(null, user);
      } else {
        next(null, false);
      }
    })
    .catch((err) => {
      next(err, false);
    });
});

passport.use(strategy);

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyPatient = (req, res, next) => {
  console.log("user", req.user);
  if (req.user.role === roles.PATIENT) {
    next();
  } else {
    var err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};
exports.verifyHospital = (req, res, next) => {
  console.log("user", req.user);
  if (req.user.role === roles.HOSPITAL) {
    next();
  } else {
    var err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};
exports.verifyInsurer = (req, res, next) => {
  console.log("user", req.user);
  if (req.user.role === roles.INSURER) {
    next();
  } else {
    var err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin === true) {
    next();
  } else {
    var err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};
