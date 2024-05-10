import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  firstname:{
      type:String,
      required:true,
  },
  lastname:{
    type:String,
    required:true,
  },
  email:{
      type:String,
      required:true,
      unique:true,
  },
  mobile:{
      type:String,
      required:true,
      unique:true,
  },
  password:{
      type:String,
      required:true
  },
  role: {
    type: String,
    default: 'user',
  },
  card: {
    type: Array,
    default: []
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
  ],
}, { timestamps: true });

//trước khi lưu dữ liệu thì hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  const salt = await bcrypt.genSaltSync(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})
//Tọa ra methods so sánh password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.createPasswordResetToken = async function () {
  //Tạo ra một chuỗi token ngẫu nhiên
  const resettoken = crypto.randomBytes(32).toString("hex")
  //Băn chuỗi đó ra rồi cho vào db
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex")
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  //Trả về token được tạo, sau này dùng chuỗi này để tìm kiếm user trong db bằng cách băm nó ra rồi so sánh
  return resettoken
}

const User = mongoose.model('User', userSchema)

export default User