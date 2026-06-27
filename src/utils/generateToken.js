// src/utils/generateToken.js

import jwt from "jsonwebtoken";

export default function generateTokens(user, businessContext) {
  return jwt.sign(
    {
      ...user,
      ...businessContext,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}
