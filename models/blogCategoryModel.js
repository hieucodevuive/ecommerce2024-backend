import mongoose from 'mongoose'

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
}, { timestamps: true });

const BCategory = mongoose.model('BCategory', categorySchema)

export default BCategory