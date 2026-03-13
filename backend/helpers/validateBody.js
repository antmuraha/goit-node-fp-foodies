export const validateBody = (schema, optional = false) => (req, res, next) => {
  // Skip validation if optional and body is empty
  if (optional && (!req.body || Object.keys(req.body).length === 0)) {
    return next();
  }

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = value;
  next();
};

