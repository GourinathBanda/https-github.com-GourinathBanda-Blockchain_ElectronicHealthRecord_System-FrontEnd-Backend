var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
var permissionTypes = require("../permissionTypes");

var permissionSchema = new Schema({
  asker: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  permissionType: {
    required: true,
    type: String,
    enum: [permissionTypes.READ, permissionTypes.WRITE],
  },
  granted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

permissionSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Permission", permissionSchema);
