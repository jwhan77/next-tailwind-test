const mongoose = require("mongoose");
const { getSession } = require("next-auth/client");
const Session = require("../models/session");
const Account = require("../models/account");
const Challenge = require("../models/challenge");

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

export const handleSignIn = async (userId, accessToken) => {
  try {
    await updateGithubAccessToken(userId, accessToken);
    const isNewUser = await checkNewUser(userId);
    if (isNewUser) {
      createNewChallenge(userId);
    }
  } catch (e) {
    console.log(e);
    userId = mongoose.Types.ObjectId(userId);
    handleSignIn(userId, accessToken);
  }
};

const updateGithubAccessToken = async (userId, accessToken) => {
  const filter = { userId: userId };
  const update = { accessToken: accessToken };
  const request = await Account.findOneAndUpdate(filter, update);
  return request;
};

const checkNewUser = async (userId) => {
  const result = await Challenge.findOne(userId);
  return result ? false : true;
};

const createNewChallenge = async (userId) => {
  let newChallenge = new Challenge();
  newChallenge._id = userId;
  newChallenge.userId = userId;
  newChallenge.myRepos = [];

  let days = {};
  for (let i = 1; i < 101; i++) {
    days[i] = {
      complete: false,
      date: null,
      updatedByUser: false,
      message: "",
      links: [],
    };
  }
  newChallenge.days = days;
  let result = await newChallenge.save();
  return result;
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

export const getUserId = async (session) => {
  const result = await Session.findOne({
    accessToken: session.accessToken,
  });
  return result.userId;
};
