import User from '../models/userModel.js'

export const findUserByEmail = async(email) => {
  try {
    const findUser = await User.findOne({ email: email })
    if (findUser) return findUser
  } catch (error) {
    throw new Error(error)
  }
}

export const findUserById = async(id) => {
  try {
    const user = await User.findOne({ _id: id })
    .populate('wishlist')
    if (user) return user
  } catch (error) {
    throw new Error(error)
  }
}

export const deleteUserById = async(id) => {
  try {
    const result = await User.findByIdAndDelete(id)
    return 'deleted user'
  } catch (error) {
    throw new Error(error)
  }
}