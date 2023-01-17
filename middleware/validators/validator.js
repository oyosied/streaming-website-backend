const Joi = require("@hapi/joi");

const ErrorMessages = {
  password: {
    "string.min": "Password must be at least 3 characters long",
    "string.max": "Password  must be no more than 12 characters long",
    "string.pattern.base":
      "Password must be 6-12 characters containing numbers and letters only",
    "any.required":
      "Password must be 6-12 characters containing numbers and letters only",
  },
  email: {
    "any.required": "Must be a valid email",
  },
  name: {
    "string.alphanum": "Name must contain only letters and/or numbers",
    "string.min": "Name must be at least 5 characters long",
    "string.max": "Name must be no more than 10 characters long",
    "any.required": "Name is required",
  },
  phone: {
    "string.min": "Phone number must be at least 8 characters long",
    "string.max": "Phone number must be no more than 12 characters long",
    "string.pattern.base": "Phone number must contain only numbers",
    "any.required": "Phone number is required",
  },
  gender: {
    "any.only": "Gender must be one of: male, female, other",
  },
};

const Validators = {
  name: Joi.string()
    .alphanum()
    .min(5)
    .max(10)
    .required()
    .messages(ErrorMessages.name),
  email: Joi.string().email().required().messages(ErrorMessages.email),
  password: Joi.string()
    .min(6)
    .max(12)
    .pattern(new RegExp("^[a-zA-Z0-9]{6,12}$"))
    .required()
    .messages(ErrorMessages.password),
  phone: Joi.string()
    .regex(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a 10 digit number",
      "any.required": "Phone number is required",
    }),
  gender: Joi.string().valid("male", "female", "other").required().messages({
    "any.only": "Gender must be one of male, female, or other",
    "any.required": "Gender is required",
  }),
};

const registerSchema = Joi.object({
  email: Validators.email,
  password: Validators.password,
  name: Validators.name,
  phone: Validators.phone,
  gender: Validators.gender,
});

const loginSchema = Joi.object({
  email: Validators.email,
  password: Validators.password,
});

const validationOptions = {
  register: registerSchema,
  login: loginSchema,
};

const validateInputs = (req, res, next) => {
  let route = req.route.path;
  route = route.startsWith("/") ? route.substring(1) : route;
  const validationResult = validationOptions[route].validate(req.body);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ message: validationResult.error.details[0].message });
  }
  next();
};

exports.validateInputs = validateInputs;
