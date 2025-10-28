// src/validations/AuthValidation.js
import Joi from 'joi';

export const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  organizationId: Joi.number().optional(),
  departmentId: Joi.number().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
