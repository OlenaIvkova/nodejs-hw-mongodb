import multer from "multer";
import storage from "../services/cloudinary.js";

const upload = multer({ storage });

export default upload;