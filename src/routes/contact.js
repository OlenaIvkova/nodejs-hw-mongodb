import express from 'express';
import contactsController from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { contactSchema } from '../schemas/contactValidation.js';  
import isValidId from '../middlewares/isValidId.js';

const router = express.Router();

router.get('/', ctrlWrapper(contactsController.getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(contactsController.getContact));
router.post('/', validateBody(contactSchema), ctrlWrapper(contactsController.createContact));  
router.patch('/:contactId', isValidId, validateBody(contactSchema), ctrlWrapper(contactsController.updateContact));  
router.delete('/:contactId', isValidId, ctrlWrapper(contactsController.deleteContact));

export default router;