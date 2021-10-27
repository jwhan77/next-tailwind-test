const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },
    compoundId: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
    },
    providerType: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
    providerAccountId: {
      type: Number,
      required: true,
    },
    refreshToken: {
      required: false,
    },
    accessToken: {
      type: String,
      required: true,
    },
    accessTokenExpires: {
      required: false,
    },
  },
  { timestamps: true }
);

let Account;

if (mongoose.models.Account) {
  Account = mongoose.model("Account");
} else {
  Account = mongoose.model("Account", accountSchema);
}

module.exports = Account;
