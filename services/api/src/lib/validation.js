import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().min(20).required()
});

export const lifestyleSchema = Joi.object({
  transport: Joi.object({
    travelMethod: Joi.string().valid("car", "bike", "bus", "train", "walking").required(),
    fuelType: Joi.string().valid("petrol", "diesel", "electric", "hybrid").required(),
    distanceValue: Joi.number().min(0).max(10000).required(),
    distanceUnit: Joi.string().valid("perDay", "perWeek").required(),
    daysPerWeek: Joi.number().min(0).max(7).required()
  }).required(),
  food: Joi.object().required(),
  shopping: Joi.object().required(),
  energy: Joi.object().required(),
  gadgets: Joi.object().required()
}).required();
