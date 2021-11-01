const mongoose = require("mongoose");
import Challenge from "../../../models/challenge";

export default async (req, res) => {
  const { userId } = req.query;
  const userIdObject = mongoose.Types.ObjectId(userId[0]);
  const result = await Challenge.findOne({ userId: userIdObject });
  res.status(200).json(result.myRepos);
};
