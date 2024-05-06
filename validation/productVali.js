import Joi from 'joi'

export const productValidate = Joi.object({
  title: Joi.string().required().min(3).max(30),
  description: Joi.string().required().min(3).max(200),
  price: Joi.number().required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  quantity: Joi.number().required(),
})