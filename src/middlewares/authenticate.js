import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies.accessToken;
    if (!token) {
      throw createHttpError(401, "Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw createHttpError(401, "Unauthorized: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    next(createHttpError(401, `Unauthorized: ${error.message}`));
  }
};

export default authenticate;