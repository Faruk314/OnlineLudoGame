import asyncHandler from "express-async-handler";

export const initGame = asyncHandler(async (req, res) => {
  res.json("hello");
});
