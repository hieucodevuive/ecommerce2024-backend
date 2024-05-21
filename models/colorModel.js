import mongoose from 'mongoose'

// Declare the Schema of the Mongo model
var colorSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
}, 
{ 
  timestamps: true, 
});

const Color = mongoose.model('Color', colorSchema)

export default Color