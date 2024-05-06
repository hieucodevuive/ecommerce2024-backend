import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { errorHandler } from '../utils/errorHandle.js'

//Kiểm tra req có gửi kèm theo token qua trường authorization sơ đồ Bearer hay không
//Sau đố lấy cái mã token đó đem đi giải mã để lấy ra userId từ đó trả về thông tin người dùng
//Hàm này dùng để lấy và giải mã token gửi từ server về, sau đó từ token lấy thằng user
//token được gửi qua req ở phần header authorization bearer
export const authMiddleware = async (req, res, next) => {
  let token
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findById(decoded?.id)
        req.user = user
        next()
      }
    } catch (error) {
      next(error)
    }
  } else {
    return next(errorHandler(500, 'There is no token attached to the header'))
  }
}

export const isAdmin = async (req, res, next) => {
  const { email } = req.user
  const adminUser = await User.find({email})
  if (adminUser[0].role !== 'admin') {
    return next(errorHandler(500, 'You are not admin'))
  } else {
    next()
  }
}