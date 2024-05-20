import Cart from '../models/cartModel.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import Coupon from '../models/couponModel.js'
import { errorHandler } from '../utils/errorHandle.js'

export const userCart = async (req, res, next) => {
  const { cart } = req.body
  console.log(cart);
  const { _id } = req.user
  try {
    const user = await User.findById(_id)
    const alreadyExistCart = await Cart.findOne({ orderby: user._id })
    if (alreadyExistCart) {
      alreadyExistCart.remove()
    }
    // const products = cart.map(async (c) => {
    //   const getPrice = await Product.findById(c._id).select('price').exec()
    //   return {
    //     product: c._id,
    //     count: c.count,
    //     color: c.color,
    //     price: getPrice
    //   }
    // })
    let products = []
    for (let i = 0; i < cart.length; i++) {
      let object = {}
      object.product = cart[i]._id
      object.count = cart[i].count
      object.color = cart[i].color
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price
      products.push(object)
    }

    const cartTotal = products.reduce((total, product) => {
      return total + (product.price * product.count);
    }, 0)

    const newCart = await Cart.create({
      products,
      cartTotal,
      orderby: user._id
    })

    return res.status(200).json({ status: 'success', newCart })
  } catch (error) {
    next(error)
  }
}

export const getUserCart = async (req, res, next) => {
  const { _id } = req.user
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate('products.product')
    return res.status(200).json({ status: 'success', cart: cart})
  } catch (error) {
    next(error)
  }
}

export const emptyCart = async (req, res, next) => {
  const { _id } = req.user
  try {
    const user = await User.findById( _id )
    console.log(user)
    const deletedCart = await Cart.findOneAndDelete({ orderby: user._id})
    res.status(200).json({ status: 'success', deletedCart }) 
  } catch (error) {
    next(error)
  }
}

export const applyCoupon = async (req, res, next) => {
  const { coupon } = req.body
  const validCoupon = await Coupon.findOne({ name: coupon })
  if (!validCoupon) return next(errorHandler(400, 'Invalid coupon'))
  
  const user = await User.findOne({ _id: req.user._id })
  const userCart = await Cart.findOne({ orderby: user._id })
  const totalAfterDiscount = ( userCart?.cartTotal - ( userCart?.cartTotal * validCoupon.discount)/100).toFixed(2)
  await Cart.findOneAndUpdate({ orderby: user._id}, {totalAfterDiscount}, {new: true})
  return res.status(200).json({status: 'success', totalAfterDiscount})
}
