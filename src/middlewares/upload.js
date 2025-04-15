import multer from "multer";
import cloudinaryService from "../services/cloudinary.js";

const { storage } = cloudinaryService;

const upload = multer({ storage });

export default upload;



// import multer from "multer";
// import cloudinaryStorage from "../services/cloudinary.js";

// const upload = multer({ storage: cloudinaryStorage });

// export default upload;