import Contact from "../db/contactModel.js";


const getAllContacts = async () => {
  const contacts = await Contact.find();
  console.log("Fetched contacts from DB:", contacts);
  return contacts;
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  console.log(`Fetched contact with id ${id} from DB:`, contact);
  return contact;
};

const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

const updateContact = async (contactId, contactData) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
  return updatedContact;
};


const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

export default { getAllContacts, getContactById, createContact, updateContact, deleteContact };
