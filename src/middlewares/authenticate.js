import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

const authenticate = (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next(createHttpError(401, "Authorization header missing"));
  }

  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return next(createHttpError(401, "Access token missing"));
  }

  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(createHttpError(401, "Access token expired"));
    }

    
    req.user = decoded; 
    next(); 
  });
};

export default authenticate;