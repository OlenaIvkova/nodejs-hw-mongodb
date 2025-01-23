import Contact from "../db/contactModel.js";

// const getAllContacts = async () => {
//   return await Contact.find();
// };

// const getContactById = async (id) => {
//   return await Contact.findById(id);
// };

// export default { getAllContacts, getContactById };


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