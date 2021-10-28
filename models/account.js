const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    compoundId: {
      type: Schema.Types.String,
      required: true,
    },
    userId: {
      type: Schema.Types.Mixed,
      required: true,
    },
    providerType: {
      type: Schema.Types.String,
      required: true,
    },
    providerId: {
      type: Schema.Types.String,
      required: true,
    },
    providerAccountId: {
      type: Schema.Types.Number,
      required: true,
    },
    refreshToken: {
      required: false,
    },
    accessToken: {
      type: Schema.Types.String,
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
