const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const ServerManager = require("../../utils/Managers/ServerManager.js");
const HttpError = require("../../models/http-error.js");

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
    "string.email": "Must be a valid email",
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
  phone: Joi.string().min(6).max(12).required().messages({
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

const validateToken = (req) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, ServerManager.jwt_secret);
    req.user = decoded;
    return true;
  } catch (err) {
    return false;
  }
};
const validateTokenWithResponse = (req, res) => {
  const isTokenValid = validateToken(req);
  if (isTokenValid) {
    res.status(200).json({ error: false, message: "Token is valid" });
  } else {
    res.status(400).json({ error: true, message: "Token is invalid" });
  }
};

const validateTokenWithNext = (req, res, next) => {
  const isTokenValid = validateToken(req);
  if (isTokenValid) {
    next();
  } else {
    res.status(400).json({ error: true, message: "Token is invalid" });
  }
};

exports.validateToken = validateToken;
exports.validateInputs = validateInputs;
exports.validateTokenWithNext = validateTokenWithNext;
exports.validateTokenWithResponse = validateTokenWithResponse;
