import mongoose from 'mongoose'

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB is connected!')
    })
  } catch (error) {
    console.log(error)
  }
}
