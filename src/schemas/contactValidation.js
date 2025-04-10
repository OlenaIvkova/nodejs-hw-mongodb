import Joi from 'joi';

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().pattern(/^\d+$/).required(),
  email: Joi.string().email().required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').default('personal').required(),
});

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
  registerSchema,
  loginSchema
};
