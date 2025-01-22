import contactsService from "../services/contacts.js";

export const getContacts = async (req, res) => {
  const contacts = await contactsService.getAllContacts();
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export default { getContacts, getContact };

// const getContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find(); 
//     res.status(200).json({
//       status: 200,
//       message: "Successfully found students!",
//       data: contacts,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };