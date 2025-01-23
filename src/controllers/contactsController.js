import contactsService from "../services/contacts.js";

export const getContacts = async (req, res) => {
  console.log("GET /contacts called");
  const contacts = await contactsService.getAllContacts();
  console.log("Found contacts:", contacts);
  res.status(200).send(
    JSON.stringify(
      {
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
      },
      null, // Для перетворення в "в стовпчик"
      2 // Кількість пробілів для відступів
    )
  );
};

export const getContact = async (req, res) => {
  const { contactId } = req.params;
  console.log(`GET /contacts/${contactId} called`);
  const contact = await contactsService.getContactById(contactId);
  if (!contact) {
    console.log("Contact not found");
    return res.status(404).json({ message: "Contact not found" });
  }
  console.log("Found contact:", contact);
  res.status(200).send(
    JSON.stringify(
      {
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      },
      null, // Для перетворення в "в стовпчик"
      2 // Кількість пробілів для відступів
    )
  );
};

export default { getContacts, getContact };