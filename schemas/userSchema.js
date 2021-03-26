var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new Schema({
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "",
    unique: true,
    required: true,
  },
  email: {
    type: String,
    default: "",
    unique: true,
    required: true,
  },
  role: {
    type: String,
    default: "PATIENT",
    required: true,
  },
  aadhar: {
    type: String,
    unique: true,
  },
  encryptionKey: {
    type: String,
  },
  scAccountAddress: {
    type: String,
  },
  phoneNo: {
    type: Number,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
