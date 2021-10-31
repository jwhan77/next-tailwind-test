const mongoose = require("mongoose");
import { getSession } from "next-auth/client";
import Challenge from "../../../models/challenge";

const { getUserId } = require("../../../lib/db");

export default async (req, res) => {
  const session = await getSession({ req });
  const userId = await getUserId(session);

  if (req.method === "POST") {
    const filter = { userId: userId };
    const update = { myRepos: req.body };
    const result = await Challenge.findOneAndUpdate(filter, update);
    res.status(200).json(result);
  }
  const result = await Challenge.findOne({ userId: userId });
  res.status(200).json(result.myRepos);
};
