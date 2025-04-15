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
    const { name, email, phoneNumber, contactType, isFavourite } = req.body;
    const photoUrl = req.file?.path || "";

    const newContact = new Contact({
      name,
      email,
      phoneNumber,
      contactType,
      isFavourite,
      userId: req.user._id,
      photo: photoUrl,
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
    const updateData = { ...req.body };
    if (req.file?.path) {
      updateData.photo = req.file.path;
    }

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, userId: req.user._id },
      updateData,
      { new: true }
    );

    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: "Contact successfully updated",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// const updateContact = async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     const contact = await Contact.findOneAndUpdate(
//       { _id: contactId, userId: req.user._id },
//       req.body,
//       { new: true }
//     );
//     if (!contact) {
//       throw createHttpError(404, 'Contact not found');
//     }
//     res.json({
//       status: 200,
//       message: 'Contact successfully updated',
//       data: contact,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

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

const uploadContactPhoto = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const photoUrl = req.file?.path;

    if (!photoUrl) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      { photo: photoUrl },
      { new: true }
    );

    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: "Photo successfully uploaded",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export default { getContacts, getContact, createContact, updateContact, deleteContact, uploadContactPhoto };