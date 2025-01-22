import Contact from "../db/contactModel.js";

const getAllContacts = async () => {
  return await Contact.find();
};

const getContactById = async (id) => {
  return await Contact.findById(id);
};

export default { getAllContacts, getContactById };