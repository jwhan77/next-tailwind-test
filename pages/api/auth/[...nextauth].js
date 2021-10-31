import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

import { getMongoose, handleSignIn } from "../../../lib/db";
import models from "../../../models";

export default async function auth(req, res) {
  return await NextAuth(req, res, {
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
    callbacks: {
      signIn: async (user, account, profile) => {
        const mongoose = await getMongoose();
        await handleSignIn(user.id, account.accessToken);
        return true;
      },
      session: async (session, token) => {
        return session;
      },
    },
  });
}
