import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
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
