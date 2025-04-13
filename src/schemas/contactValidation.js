import Joi from 'joi';

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phoneNumber: Joi.string().pattern(/^\d+$/).required(),
  email: Joi.string().email().optional(), 
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid("personal", "work", "home", "business").optional().default("personal"),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phoneNumber: Joi.string().pattern(/^\d+$/),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("personal", "work", "home", "business"),
}).min(1);

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export default {
  contactSchema,
  updateContactSchema,
  registerSchema,
  loginSchema,
};