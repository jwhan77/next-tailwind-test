const mongoose = require("mongoose");
const { getSession, session } = require("next-auth/client");
const Session = require("../models/session");
const Account = require("../models/account");

const url = process.env.MONGODB_URL;

/* Connection ready state */
const DISCONNECTED = 0;
const CONNECTED = 1;
const CONNECTING = 2;
const DISCONNECTING = 3;

export const getMongoose = async () => {
  if (mongoose.connection.readyState === DISCONNECTED) {
    mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((result) => {
        console.log("connected to db");
        return mongoose;
      })
      .catch((err) => console.log("cannot connect to db : ", err));
  } else if (mongoose.connection.readyState === CONNECTED) {
    return mongoose;
  } else if (mongoose.connection.readyState === CONNECTING) {
    setTimeout(() => {
      getMongoose();
    }, 2000);
  } else if (mongoose.connection.readyState === DISCONNECTING) {
    console.log("disconnecting...");
    return mongoose;
  }
};

export const getGithubAccessToken = async (req) => {
  const _session = await getSession({ req });
  const reqSession = await Session.findOne({
    accessToken: _session.accessToken,
  });
  const reqAccount = await Account.findOne({
    userId: reqSession.userId,
  });
  return reqAccount.accessToken;
};
