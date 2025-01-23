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

export default { getAllContacts, getContactById };