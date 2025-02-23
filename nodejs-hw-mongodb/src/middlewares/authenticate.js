import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../models/user.js";

const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw createHttpError(401, "Unauthorized");
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw createHttpError(401, "User not found");
    }

    req.user = user;
    next();
  } catch {
    next(createHttpError(401, "Invalid token"));
  }
};

export default authenticate;