const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.Mixed,
    required: true,
  },
  myRepos: {
    type: Schema.Types.Array,
    required: false,
  },
  days: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

let Challenge;

if (mongoose.models.Challenge) {
  Challenge = mongoose.model("Challenge");
} else {
  Challenge = mongoose.model("Challenge", challengeSchema);
}

module.exports = Challenge;
