import createError from "http-errors";
import contactsService from "../services/contacts.js";
import Contact from "../db/contactModel.js"; 
import contactSchema from "../schemas/contactValidation.js";
// import { validateContact } from '../schemas/contactValidation.js';
// import Joi from "joi";


const getContacts = async (req, res) => {
  const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
  
  const query = {};
  if (type) query.contactType = type;
  if (isFavourite !== undefined) query.isFavourite = isFavourite === 'true';

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const contacts = await Contact.find(query)
    .skip((page - 1) * perPage)
    .limit(Number(perPage))
    .sort(sort);
  
  const totalItems = await Contact.countDocuments(query);
  const totalPages = Math.ceil(totalItems / perPage);
  
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);
  if (!contact) return next(createError(404, "Contact not found"));
  res.status(200).json({ status: 200, message: "Successfully found contact!", data: contact });
};


const createContact = async (req, res, next) => {
  try {
    
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const newContact = await contactsService.createContact(req.body);
    res.status(201).json({ status: 201, message: "Successfully created a contact!", data: newContact });
  } catch (error) {
    next(error);
  }
};


const updateContact = async (req, res, next) => {
  const { contactId } = req.params;

  
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return next(createError(400, error.details[0].message));
  }

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