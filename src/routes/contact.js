import express from 'express';
import contactsController from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';  
import isValidId from '../middlewares/isValidId.js';
import authenticate from "../middlewares/authenticate.js";
import validationSchemas from '../schemas/contactValidation.js';
import upload from "../middlewares/upload.js";

const { contactSchema, updateContactSchema } = validationSchemas;

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    ctrlWrapper(contactsController.getContacts));

router.get(
    "/:contactId",
    isValidId,
    ctrlWrapper(contactsController.getContact));

router.post(
"/",
upload.single("photo"),
validateBody(contactSchema),
    ctrlWrapper(contactsController.createContact));

router.patch(
"/:contactId",
isValidId,
upload.single("photo"), 
validateBody(updateContactSchema),
ctrlWrapper(contactsController.updateContact) 
);

router.delete(
    "/:contactId",
    isValidId,
    ctrlWrapper(contactsController.deleteContact));

export default router;