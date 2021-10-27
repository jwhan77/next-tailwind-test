const { Octokit } = require("@octokit/core");
import { getSession } from "next-auth/client";

const { getMongoose, getGithubAccessToken } = require("../../../lib/db");

export default async (req, res) => {
  const session = await getSession({ req });
  const mongoose = await getMongoose();
  const githubAccessToken = await getGithubAccessToken(req);

  const octokit = new Octokit({ auth: githubAccessToken });
  const { data } = await octokit.request("GET /user/repos", {
    affiliation: "owner",
    sort: "pushed",
  });
  res.status(200).json(data);
};
