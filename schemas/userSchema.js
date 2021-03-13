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
    default: "patient",
    required: true,
  },
  aadhar: {
    type: String,
    unique: true,
  },
  encryptionKey: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { encryptionKey: { $type: "string" } }
    }
  },
  scAccountAddress: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { scAccountAddress: { $type: "string" } }
    }
  },
  phoneNo: {
    type: Number,
    unique: true,
  },
});

// admin: {
//   type: Boolean,
//   default: false,
// },
// seller: {
//     type: Boolean,
//     default: false,
//   },

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
