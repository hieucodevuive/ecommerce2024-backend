import Joi from 'joi'

export const authValidate = Joi.object({
  firstname: Joi.string().required().min(3).max(30),
  lastname: Joi.string().required().min(3).max(30),
  email: Joi.string().required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }}),
  password: Joi.string().required(),
  mobile: Joi.string().required().max(11)
})