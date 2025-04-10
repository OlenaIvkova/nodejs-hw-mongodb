import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies.accessToken;
  console.log("Token received:", token);

  if (!token) {
    throw createHttpError(401, "Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    throw createHttpError(401, "Unauthorized: Invalid token");
  }
};

export default authenticate;


// import jwt from 'jsonwebtoken';
// import createHttpError from 'http-errors';

// const authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   console.log("Authorization Header:", authHeader);

//   if (!authHeader) {
//     return next(createHttpError(401, 'Authorization header is missing'));
//   }

//   const token = authHeader.split(' ')[1]; 
//   console.log("Extracted Token:", token);

//   if (!token) {
//     return next(createHttpError(401, 'Access token is missing'));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded JWT:", decoded);  

//     if (decoded.exp && Date.now() >= decoded.exp * 1000) { 
//       return next(createHttpError(401, 'Access token expired'));
//     }

//     req.user = { _id: decoded.userId };
//     next();
//   } catch (error) {
//      console.error(error);
//     next(createHttpError(401, 'Invalid or expired access token'));
//   }
// };

// export default authenticate;
