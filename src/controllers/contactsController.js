import createHttpError from 'http-errors';
import Contact from "../db/contactModel.js";

const getContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = "createdAt", sortOrder = "desc" } = req.query;
    const userId = req.user._id;

    const totalItems = await Contact.countDocuments({ userId });
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    const contacts = await Contact.find({ userId })
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data: {
        data: contacts,
        page: Number(page),
        perPage: Number(perPage),
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findOne({ _id: contactId, userId: req.user._id });
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({ status: 200, data: contact });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, contactType } = req.body;
    if (!req.user || !req.user._id) {
      throw createHttpError(401, "User is not authenticated");
    }

    const newContact = new Contact({
      name,
      email,
      phoneNumber,
      contactType,
      userId: req.user._id,
    });

    await newContact.save();

    res.status(201).json({
      status: 201,
      message: "Contact successfully created",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({
      status: 200,
      message: 'Contact successfully updated',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findOneAndDelete({ _id: contactId, userId: req.user._id });
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({ status: 200, message: 'Contact successfully deleted' });
  } catch (error) {
    next(error);
  }
};

export default { getContacts, getContact, createContact, updateContact, deleteContact };
