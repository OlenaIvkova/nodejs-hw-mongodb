const validateBody = (schema) => {
  return (req, res, next) => {
    console.log('Validating with schema:', schema.describe?.());
    console.log('Validating with contactType allowed values:', schema.describe?.().keys?.contactType?.allow);
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 400, message: error.details[0].message });
    }
    next();
  };
};

export default validateBody;