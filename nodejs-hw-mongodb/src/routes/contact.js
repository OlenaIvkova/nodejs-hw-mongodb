import express from "express";
import Contact from "../db/contactModel.js";
import authenticate from "../middlewares/authenticate.js"; 
import createHttpError from "http-errors";

const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id }); 
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user._id });

    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const newContact = new Contact({ ...req.body, userId: req.user._id }); 
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", authenticate, async (req, res, next) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, 
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      throw createHttpError(404, "Contact not found or access denied");
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!deletedContact) {
      throw createHttpError(404, "Contact not found or access denied");
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;