const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    sessionToken: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let Session;

if (mongoose.models.Session) {
  Session = mongoose.model("Session");
} else {
  Session = mongoose.model("Session", sessionSchema);
}

module.exports = Session;
