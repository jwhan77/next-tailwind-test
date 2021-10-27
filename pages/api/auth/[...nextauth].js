import NextAuth from "next-auth";
import Providers from "next-auth/providers";
// import { MongoClient, ObjectId } from "mongodb";
import Adapters from "next-auth/adapters";
// import mongoose from "mongoose";

// import clientPromise from "../../../lib/mongodb";
import models from "../../../models";
// const Session = require("../../../models/session");

// const client = new MongoClient(process.env.MONGODB_URL);

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    jwt: {
      encryption: true,
    },
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        scope: "read:user user:email repo",
      }),
    ],
    adapter: Adapters.TypeORM.Adapter(process.env.MONGODB_URL, {
      models: {
        User: models.User,
      },
    }),
    database: process.env.MONGODB_URL,
    // callbacks: {
    //   session: async (session, token) => {
    //     session.accessToken = token.githubAccessToken;
    //     console.log("return session", session);
    //     return session;

    //     // mongoose
    //     //   .connect(process.env.mONGODB_URL, {
    //     //     useNewUrlParser: true,
    //     //     useUnifiedTopology: true,
    //     //   })
    //     //   .then((result) => {
    //     //     console.log("connected to db");
    //     //     Session.findOne({ accessToken: session.accessToken })
    //     //       .then((result) => {
    //     //         console.log("found one", result);
    //     //         session.userId = result.userId;
    //     //         console.log(session.userId);
    //     //         return session;
    //     //       })
    //     //       .catch((err) => console.log("err : ", err));
    //     //   })
    //     //   .catch((err) => {
    //     //     console.log("cannot connect to db");
    //     //     console.log(err);
    //     //   });
    //     // session.accessToken = token.githubAccessToken;
    //   },
    // },
    // jwt: async (token, user, account, profile) => {
    //   console.log("account: ", account);
    //   if (user && account && account.provider === "github") {
    //     token.username = profile.login;
    //     token.githubAccessToken = account.accessToken;
    //   }

    //   return Promise.resolve(token);
    // },
  });
}
