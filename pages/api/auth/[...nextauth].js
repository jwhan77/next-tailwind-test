import NextAuth from "next-auth";
import Providers from "next-auth/providers";
// import { MongoClient, ObjectId } from "mongodb";
import Adapters from "next-auth/adapters";

// import clientPromise from "../../../lib/mongodb";
import models from "../../../models";

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
    // adapter: mongoDBAdapter({
    //   db: (await clientPromise).db(process.env.MONGODB_DB),
    //   ObjectId,
    // }),
    database: process.env.MONGODB_URL,
    callbacks: {
      session: async (session, token) => {
        session.accessToken = token.githubAccessToken;
        return session;
      },
      jwt: async (token, user, account, profile) => {
        if (user && account && account.provider === "github") {
          token.username = profile.login;
          token.githubAccessToken = account.accessToken;
        }

        return Promise.resolve(token);
      },
    },
  });
}
