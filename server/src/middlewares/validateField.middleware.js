export const validateFields = (fields) => (req, res, next) => {
  const missingFields = fields.some((field) => req.body[field]?.trim() === '');
  console.log(missingFields);

  if (missingFields) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }
  next();
};
