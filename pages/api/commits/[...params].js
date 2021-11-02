const { Octokit } = require("@octokit/core");
import { getSession } from "next-auth/client";
const { getMongoose, getGithubAccessToken } = require("../../../lib/db");

export default async (req, res) => {
  const { params } = req.query;
  const owner = params[0];
  const repo = params[1];

  const session = await getSession({ req });
  const mongoose = await getMongoose();
  const githubAccessToken = await getGithubAccessToken(req);

  const octokit = new Octokit({ auth: githubAccessToken });
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/commits", {
    owner: owner,
    repo: repo,
  });

  let commits = data.filter((commit) => commit.committer.login === owner);
  commits = commits.map((commit) => ({
    html_url: commit.html_url,
    date: commit.commit.author.date,
    message: commit.commit.message,
  }));

  res.status(200).json(commits);
};
