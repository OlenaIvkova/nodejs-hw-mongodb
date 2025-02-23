import Contact from "../db/contactModel.js";


const getAllContacts = async (userId) => {
  const contacts = await Contact.find(userId);
  console.log("Fetched contacts from DB:", contacts);
  return contacts;
};

const getContactById = async (id, userId) => {
  const contact = await Contact.findOne({ _id: id, userId });

  console.log(`Fetched contact with id ${id} from DB:`, contact);
  return contact;
};

const createContact = async (contactData, userId) => {
  return await Contact.create(contactData, userId);
};

const updateContact = async (contactId, userId, contactData) => {
  const updatedContact = await Contact.findOneAndUpdate(
  { _id: contactId, userId },
  contactData,
  { new: true }
);
  return updatedContact;
};

const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};

export default { getAllContacts, getContactById, createContact, updateContact, deleteContact };