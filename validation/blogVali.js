import Joi from 'joi'

export const blogValidate = Joi.object({
  title: Joi.string().required().min(3).max(30),
  description: Joi.string().required().min(3).max(200),
  category: Joi.string().required()
})