import contactsService from "../services/contacts.js";

export const getContacts = async (req, res) => {
  console.log("GET /contacts called");
  const contacts = await contactsService.getAllContacts();
  console.log("Found contacts:", contacts);
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
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
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({ message: "Name and phone number are required" });
    }

    const newContact = await contactsService.createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    res.status(201).json({
      status: 201,
      message: "Contact created successfully!",
      data: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { getContacts, getContact };