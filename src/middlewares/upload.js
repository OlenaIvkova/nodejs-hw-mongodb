import multer from "multer";
import cloudinaryService from "../services/cloudinary.js";

const { storage } = cloudinaryService;

const upload = multer({ storage });

export default upload;