import { errorHandler } from '../utils/errorHandle.js'
import { authValidate, loginValidate } from '../validation/authVali.js'
// import bcryptjs from 'bcryptjs'
import User from '../models/userModel.js'
import { findUserByEmail, findUserById, deleteUserById } from '../services/userService.js'
import { generateToken } from '../config/jwtToken.js'

export const createUser = async(req, res, next) => {
  try {
    //Validete dữ liệu dựa trên joi
    const validateData = await authValidate.validateAsync(req.body)
    const { email, password } = validateData
    //Tìm xem đã tồn tại người dùng này chưa
    const findUser = await findUserByEmail(email)
    if(findUser) return next(errorHandler(500, 'User already exists'))

    else {
      //Hash password using bcryptjs
      // const hashPassword = bcryptjs.hashSync(password, 10)
      // const data = {
      //   ...validateData,
      //   password: hashPassword
      // }
      // const newUser = await User.create(data)
      const newUser = await User.create(validateData)
      res.status(200).json({
        status: 'success',
        newUser: newUser
      })
    }
  } catch (error) {
    next(error)
  }
}

export const loginUser = async(req, res, next) => {
  try {
    const validateData = await loginValidate.validateAsync(req.body)
    const { email, password } = validateData
    //Kiểm tra xem user có tồn tại hay không
    const findUser = await findUserByEmail(email)
    if (!findUser) return next(errorHandler(500, 'User not found'))
    //Nếu tồn tại user và mật khẩu chính xác, isPasswordMatched là một method được tạo ra trong userScheemer
    if (findUser &&  await findUser.isPasswordMatched(password)) {
      res.status(200).json({ 
        status: 'success',
        user: {
          _id: findUser?._id,
          firstname: findUser?.firstname,
          lastname: findUser?.lastname,
          email: findUser?.email,
          mobile: findUser?.mobile,
          token: generateToken(findUser?._id)
        } 
      })
    } else {
      return next(errorHandler(500, 'Password is incorrect!'))
    }
  } catch (error) {
   next(error) 
  }
}

export const getAllUser = async(req, res, next) => {
  try {
    const allUsers = await User.find()
    const sanitizedUsers = allUsers.map(user => {
      const { password, ...res } = user._doc
      return res
  })
    res.status(200).json({
      status: 'success',
      users: sanitizedUsers
    })
  } catch (error) {
    next(error)
  }
}

export const getUser = async(req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await findUserById(userId)
    if (user) {
      const { password, ...userWithouthPassword } = user._doc
      res.status(200).json({ status: 'success', user: userWithouthPassword })
    }
    return next(errorHandler(500, 'User not found'))
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async(req, res, next) => {
  try {
    const userId = req.params.userId
    const result = await deleteUserById(userId)
    res.status(200).json({
      status: 'success',
      message: result
    })
  } catch (error) {
    next(error)
  }
}