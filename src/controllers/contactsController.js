import createError from "http-errors";
import contactsService from "../services/contacts.js";

const getContacts = async (req, res) => {
  const contacts = await contactsService.getAllContacts();
  res.status(200).json({ status: 200, message: "Successfully found contacts!", data: contacts });
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);
  if (!contact) return next(createError(404, "Contact not found"));
  res.status(200).json({ status: 200, message: "Successfully found contact!", data: contact });
};

const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.createContact(req.body);
    res.status(201).json({ status: 201, message: "Successfully created a contact!", data: newContact });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedContact = await contactsService.updateContact(contactId, req.body);
  if (!updatedContact) return next(createError(404, "Contact not found"));
  res.status(200).json({ status: 200, message: "Successfully patched a contact!", data: updatedContact });
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await contactsService.deleteContact(contactId);
  if (!deletedContact) return next(createError(404, "Contact not found"));
  res.status(204).send();
};

export default { getContacts, getContact, createContact, updateContact, deleteContact };