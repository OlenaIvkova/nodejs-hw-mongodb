import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Нове поле userId
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;