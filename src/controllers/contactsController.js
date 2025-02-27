import createHttpError from 'http-errors';
// import contactsService from "../services/contacts.js";
import Contact from "../db/contactModel.js"; 
// import contactSchema from "../schemas/contactValidation.js";



const getContacts = async (req, res) => {
  const contacts = await Contact.find({ userId: req.user._id });
  res.json({ status: 'success', data: contacts });
};

const getContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findOne({ _id: contactId, userId: req.user._id });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({ status: 'success', data: contact });
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
      status: "success",
      message: "Contact successfully created",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// const createContact = async (req, res) => {
//   const { name, email, phoneNumber } = req.body;
//   const newContact = new Contact({
//     name,
//     email,
//     phoneNumber,
//     userId: req.user._id,
//   });
//   await newContact.save();
//   res.status(201).json({
//     status: 'success',
//     message: 'Contact successfully created',
//     data: newContact,
//   });
// };

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findOne({ _id: contactId, userId: req.user._id });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  const updatedContact = await Contact.findOneAndUpdate({ _id: contactId, userId: req.user._id }, req.body, { new: true });
  res.json({
    status: 'success',
    message: 'Contact successfully updated',
    data: updatedContact,
  });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findOne({ _id: contactId, userId: req.user._id });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  await Contact.findOneAndDelete({ _id: contactId, userId: req.user._id });
  res.status(200).json({ status: 'success', message: 'Contact successfully deleted' });
};


export default { getContacts, getContact, createContact, updateContact, deleteContact };