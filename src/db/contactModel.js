import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, required: false, default: "personal" },
  },
  { timestamps: true }
);

const Contact = mongoose.model("contacts", contactSchema);

export default Contact;