import asyncHandler from "express-async-handler";
import query from "../db.js";

export const changeAvatar = asyncHandler(async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user.userId;

  try {
    let q = "UPDATE users SET `image`= ? WHERE `userId`= ?";

    await query(q, [avatar, userId]);

    res.status(200).json("Avatar updated");
  } catch (err) {
    res.status(400);
    throw new Error("Could not update avatar");
  }
});
