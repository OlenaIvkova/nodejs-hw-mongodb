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


// import jwt from "jsonwebtoken";
// import createHttpError from "http-errors";

// const authenticate = (req, res, next) => {
  
//   const authHeader = req.headers.authorization;
  
//   if (!authHeader) {
//     return next(createHttpError(401, "Authorization header missing"));
//   }

//   const token = authHeader.split(" ")[1]; 

//   if (!token) {
//     return next(createHttpError(401, "Access token missing"));
//   }

  
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return next(createHttpError(401, "Access token expired"));
//     }

    
//     req.user = decoded; 
//     next(); 
//   });
// };

// export default authenticate;