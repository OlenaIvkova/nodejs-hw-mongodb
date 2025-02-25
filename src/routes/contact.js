import express from 'express';
import contactsController from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import contactSchema from '../schemas/contactValidation.js';  
import isValidId from '../middlewares/isValidId.js';
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.get("/", authenticate, ctrlWrapper(contactsController.getContacts));
router.get("/:contactId", authenticate, isValidId, ctrlWrapper(contactsController.getContact));
router.post("/", authenticate, validateBody(contactSchema), ctrlWrapper(contactsController.createContact));
router.patch("/:contactId", authenticate, isValidId, validateBody(contactSchema), ctrlWrapper(contactsController.updateContact));
router.delete("/:contactId", authenticate, isValidId, ctrlWrapper(contactsController.deleteContact));

export default router;