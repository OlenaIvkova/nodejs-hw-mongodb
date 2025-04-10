import Joi from "joi";

export const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  
  return schema.validate(data);
};




// import Joi from 'joi';

// const registerSchema = Joi.object({
//   name: Joi.string().min(3).required().messages({
//     'string.min': 'Name should have at least 3 characters',
//     'any.required': 'Name is required',
//   }),
//   email: Joi.string().email().required().messages({
//     'string.email': 'Invalid email format',
//     'any.required': 'Email is required',
//   }),
//   password: Joi.string().min(6).required().messages({
//     'string.min': 'Password should have at least 6 characters',
//     'any.required': 'Password is required',
//   }),
// });

// export const validateRegister = (data) => {
//   return registerSchema.validate(data);
// };