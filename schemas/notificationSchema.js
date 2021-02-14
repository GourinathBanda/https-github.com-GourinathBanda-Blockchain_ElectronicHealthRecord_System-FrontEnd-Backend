const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ! NOT GONNA USE THIS FOR NOW

const notification = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const notificationSchema = new Schema({
  user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
});

var Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
