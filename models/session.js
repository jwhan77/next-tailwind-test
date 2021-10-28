const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    expires: {
      type: Schema.Types.Date,
      required: true,
    },
    sessionToken: {
      type: Schema.Types.String,
      required: true,
    },
    accessToken: {
      type: Schema.Types.String,
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
