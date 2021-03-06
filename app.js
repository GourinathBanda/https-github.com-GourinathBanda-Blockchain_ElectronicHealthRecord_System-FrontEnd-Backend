var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var compression = require("compression");
var helmet = require("helmet");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var viewRouter = require("./routes/view");
var addRouter = require("./routes/add");
var app = express();
var passport = require("passport");
var authenticate = require("./authenticate");
var fileUpload = require("express-fileupload");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(helmet());
// app.use(fileUpload());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/uploads/",
  })
);

mongoose
  // .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  // .connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true })
  .connect(
    "mongodb+srv://testuser:testpass@testdb.t4jy6.gcp.mongodb.net/venuedb?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(
    (e) => {
      console.log("Connected to db");
    },
    (err) => console.log(err)
  );

app.use(cors());

// app.use(express.static("build"));

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/view", viewRouter);
app.use("/api/add", addRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
