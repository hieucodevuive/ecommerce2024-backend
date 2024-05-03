import { errorHandler } from '../utils/errorHandle.js'
import { authValidate } from '../validation/authVali.js'
import bcryptjs from 'bcryptjs'
import User from '../models/userModel.js'

export const createUser = async(req, res, next) => {
  try {
    //Validete dữ liệu dựa trên joi
    const validateData = await authValidate.validateAsync(req.body)
    const { email, password } = validateData
    //Tìm xem đã tồn tại người dùng này chưa
    const findUser = await User.findOne({ email: email })
    if(findUser) return next(errorHandler(500, 'User already exists'))
    //Hash password
    else {
      const hashPassword = bcryptjs.hashSync(password, 10)
      const data = {
        ...validateData,
        password: hashPassword
      }
      const newUser = await User.create(data)
      res.status(200).json({
        status: 'success',
        newUser: newUser
      })
    }
  } catch (error) {
    next(error)
  }
}