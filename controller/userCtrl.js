import { errorHandler } from '../utils/errorHandle.js'
import { authValidate, loginValidate } from '../validation/authVali.js'
// import bcryptjs from 'bcryptjs'
import User from '../models/userModel.js'
import { validateMongoDbId } from '../utils/validateMongodbId.js'
import { findUserByEmail, findUserById, deleteUserById } from '../services/userService.js'
import { generateToken } from '../config/jwtToken.js'
import { generateRefreshToken } from '../config/refreshToken.js'
import jwt from 'jsonwebtoken'
import { sendEmail } from './emailCtrl.js'
import crypto from 'crypto'

export const createUser = async (req, res, next) => {
  try {
    //Validete dữ liệu dựa trên joi
    const validateData = await authValidate.validateAsync(req.body)
    const { email, password } = validateData
    //Tìm xem đã tồn tại người dùng này chưa
    const findUser = await findUserByEmail(email)
    if (findUser) return next(errorHandler(500, 'User already exists'))

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

export const loginUser = async (req, res, next) => {
  try {
    const validateData = await loginValidate.validateAsync(req.body)
    const { email, password } = validateData
    //Kiểm tra xem user có tồn tại hay không
    const findUser = await findUserByEmail(email)
    if (!findUser) return next(errorHandler(500, 'User not found'))
    //Nếu tồn tại user và mật khẩu chính xác, isPasswordMatched là một method được tạo ra trong userScheemer
    if (findUser && await findUser.isPasswordMatched(password)) {
      //Tọa ra refreshToken rồi cập nhật trong db
      const refreshToken = await generateRefreshToken(findUser?._id)
      const updateUser = await User.findByIdAndUpdate(findUser?._id, {
        refreshToken: refreshToken
      }, { new: true })

      //trả về refreshToken lên cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 71 * 60 * 60 * 1000
      })

      res.status(200).json({
        status: 'success',
        user: {
          _id: findUser?._id,
          firstname: findUser?.firstname,
          lastname: findUser?.lastname,
          email: findUser?.email,
          mobile: findUser?.mobile,
          role: findUser?.role,
          //tạo gửi lên client 1 cái token
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

//adnim login
export const loginAdmin = async (req, res, next) => {
  try {
    const validateData = await loginValidate.validateAsync(req.body)
    const { email, password } = validateData
    //Kiểm tra xem user có tồn tại hay không
    const findAdmin = await findUserByEmail(email)
    if (findAdmin.role !== 'admin') return next(errorHandler(400, 'You are not admin'))
    if (!findAdmin) return next(errorHandler(500, 'Admin not found'))
    //Nếu tồn tại user và mật khẩu chính xác, isPasswordMatched là một method được tạo ra trong userScheemer
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
      //Tọa ra refreshToken rồi cập nhật trong db
      const refreshToken = await generateRefreshToken(findAdmin?._id)
      const updateUser = await User.findByIdAndUpdate(findAdmin?._id, {
        refreshToken: refreshToken
      }, { new: true })

      //trả về refreshToken lên cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 71 * 60 * 60 * 1000
      })

      res.status(200).json({
        status: 'success',
        user: {
          _id: findAdmin?._id,
          firstname: findAdmin?.firstname,
          lastname: findAdmin?.lastname,
          email: findAdmin?.email,
          mobile: findAdmin?.mobile,
          //tạo gửi lên client 1 cái token
          token: generateToken(findAdmin?._id)
        }
      })
    } else {
      return next(errorHandler(500, 'Password is incorrect!'))
    }
  } catch (error) {
    next(error)
  }
}

// handle refresh token
export const handleRefreshToken = async (req, res, next) => {
  const cookie = req.cookies
  if (!cookie?.refreshToken) return next(errorHandler(500, 'No refresh token'))
  // Lấy refresh token từ cookie
  const refreshToken = cookie.refreshToken
  //Tìm kiếm user dựa trên refresh token
  const user = await User.findOne({ refreshToken })
  if (!user) return next(errorHandler(500, 'No Refresh token matched'))
  //Giải mã cái rf token nhận được useId
  jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
    //Nếu user id === id được giải mã thì lại tạo ra access token dựa trên user id
    if (err || user.id !== decoded.id) {
      return next(errorHandler(500, 'There is something wrong with refresh token'))
    }
    const accessToken = generateToken(user?._id)
    res.json({ accessToken })
  })
}

export const logout = async (req, res, next) => {
  const cookie = req.cookies
  if (!cookie?.refreshToken) return next(errorHandler(500, 'No refresh token'))
  const refreshToken = cookie.refreshToken
  const user = await User.findOne({ refreshToken })
  if (!user) {
    res.clearCookie('refreshToken'), {
      httpOnly: true,
      secure: true
    }
    return res.status(200).json({ status: 'success', message: 'No user login' })
  }

  const updateUser = await User.findOneAndUpdate({ refreshToken }, {
    refreshToken: ''
  }, { new: true });
  console.log('🚀 ~ logout ~ updateUser:', updateUser)

  res.clearCookie('refreshToken'), {
    httpOnly: true,
    secure: true
  }
  return res.status(200).json({ status: 'success', message: 'User loged out' })
}

export const getAllUser = async (req, res, next) => {
  try {
    const allUsers = await User.find()
      .populate('wishlist')
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

export const getUser = async (req, res, next) => {
  const userId = req.params.userId
  validateMongoDbId(userId)
  try {
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

export const deleteUser = async (req, res, next) => {
  const userId = req.params.userId
  validateMongoDbId(userId)
  try {
    const result = await deleteUserById(userId)
    res.status(200).json({
      status: 'success',
      message: result
    })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  const { _id } = req.user
  validateMongoDbId(_id)
  try {
    const updateUser = await User.findByIdAndUpdate(_id, {
      firstname: req?.body?.firstname,
      lastname: req?.body?.lastname,
      mobile: req?.body?.mobile
    },
      {
        new: true
      })
    res.status(200).json({
      status: 'success',
      user: updateUser
    })
  } catch (error) {
    next(error)
  }
}

export const blockUser = async (req, res, next) => {
  const userId = req.params.userId
  validateMongoDbId(userId)
  try {
    if (userId) {
      const blockUser = await User.findByIdAndUpdate(userId, {
        isBlocked: true
      }, { new: true })

      return res.status(200).json({ status: 'success', message: 'Blocked successfully' })
    } else {
      return next(errorHandler(500, 'User not found'))
    }
  } catch (error) {
    next(error)
  }
}

export const unblockUser = async (req, res, next) => {
  const userId = req.params.userId
  validateMongoDbId(userId)
  try {
    if (userId) {
      const unblockUser = await User.findByIdAndUpdate(userId, {
        isBlocked: false
      }, { new: true })

      return res.status(200).json({ status: 'success', message: 'Unlocked successfully' })
    } else {
      return next(errorHandler(500, 'User not found'))
    }
  } catch (error) {
    next(error)
  }
}

export const updatePassword = async (req, res, next) => {
  try {
    const { _id } = req.user
    const { password } = req.body
    validateMongoDbId(_id)
    const user = await User.findById(_id)
    if (password) {
      user.password = password
      const updatedPassword = await user.save()
      res.json({ status: 'success', message: 'Updated password', updatedPassword: updatedPassword })
    } else {
      next(errorHandler(500, 'Enter your new password'))
    }
  } catch (error) {
    next(error)
  }
}

export const forgotPasswordToken = async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      next(errorHandler(400, 'User not found'))
    }
    const token = await user.createPasswordResetToken()
    await user.save()
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3017/api/user/reset-password/${token}'>Click Here</>`
    const data = {
      to: email,
      text: 'Hey User',
      subject: 'Forgot Password Link',
      htm: resetURL,
    }
    sendEmail(data)
    res.json({status: 'success', forgotPasswordToken: token})
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async(req, res, next) => {
  
  try {
    const { password } = req.body
    const { token } = req.params

    const hashToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await User.findOne({
      passwordResetToken: hashToken,
      passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
      next(errorHandler(400, 'Token Expired, please try again'))
    }
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.status(200).json({ status: 'success', message: 'Password was changed' })
  } catch (error) {
    next(error)
  }
}

export const getWishlist = async (req, res, next) => {
  const { _id } = req.user
  validateMongoDbId(_id)
  try {
    const user = await User.findOne(_id)
      .populate('wishlist')
    const userWishlist = user.wishlist
    res.status(200).json({ status: 'success', wishlist: userWishlist })
  } catch (error) {
    next(error)
  }
}

export const saveAddress = async (req, res, next) => {
  const { _id } = req.user
  validateMongoDbId(_id)
  try {
    const updateUser = await User.findByIdAndUpdate(_id, {
      address: req?.body?.address,
    },
      {
        new: true
      })
    res.status(200).json({
      status: 'success',
      user: updateUser
    })
  } catch (error) {
    next(error)
  }
  
}