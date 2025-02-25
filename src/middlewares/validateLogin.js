import Joi from 'joi';


const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password should have at least 6 characters',
    'any.required': 'Password is required',
  }),
});

export const validateLogin = (data) => {
  return loginSchema.validate(data);
};