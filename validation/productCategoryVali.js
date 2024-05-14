import Joi from 'joi'

export const productCategoryValidate = Joi.object({
  title: Joi.string().required().min(1).max(30)
})