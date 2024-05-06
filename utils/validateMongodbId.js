import mongoose from "mongoose"
import { errorHandler } from './errorHandle.js'

export const validateMongoDbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id)
  if (!isValid) return (errorHandler(500, 'This id is not valid or not Found'))
    if (!isValid) throw new Error('This id is not valid')
}