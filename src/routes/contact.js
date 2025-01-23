import express from "express";
import { getContacts, getContact, createContact } from "../controllers/contactsController.js";

const router = express.Router();

router.get("/", getContacts);

router.get("/:contactId", getContact);

router.post("/", createContact);

export default router;