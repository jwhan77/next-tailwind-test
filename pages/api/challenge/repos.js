const mongoose = require("mongoose");
import { getSession } from "next-auth/client";
import Challenge from "../../../models/challenge";

const { getUserId } = require("../../../lib/db");

export default async (req, res) => {
  if (req.method === "POST") {
    const session = await getSession({ req });
    const userId = await getUserId(session);
    const filter = { userId: userId };
    const update = { myRepos: req.body };
    const result = await Challenge.findOneAndUpdate(filter, update);
    res.status(200).json(result);
  }
  res.status(404);
};
