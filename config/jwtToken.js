import jwt from 'jsonwebtoken'

/**
 * Các bước giữ phiên đăng nhập
 * B1: tạo ra một hàm dùng để khởi tạo mã token dựa trên id
 * B2: tại req đăng nhập thì gọi hàm token và gửi các mã token đó lên client
 * B3: Tạo authMiddleware để lấy token từ client gửi lên server thông qua header của req
 * B3: Từ token verify nó để lấy id => lấy thông tin người dùng
 */

//Tạo ra mã token
export const generateToken  = (id) => {
  return jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: '1d'})
}