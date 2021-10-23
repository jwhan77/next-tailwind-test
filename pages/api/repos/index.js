const { Octokit } = require("@octokit/core");
import { getSession } from "next-auth/client";

export default async (req, res) => {
  const session = await getSession({ req });
  const octokit = new Octokit({ auth: session.accessToken });
  const { data } = await octokit.request("GET /user/repos", {
    affiliation: "owner",
    sort: "pushed",
  });
  res.status(200).json(data);
};
