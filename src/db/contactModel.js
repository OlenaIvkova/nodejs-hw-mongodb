import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, enum: ["personal", "work", "home", "business"], default: "personal" },
    photo: { type: String, default: "" }
  },
  { timestamps: true }
);

const Contact = mongoose.model("contacts", contactSchema);

export default Contact;