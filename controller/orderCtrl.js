import Cart from '../models/cartModel.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'
import Coupon from '../models/couponModel.js'
import { errorHandler } from '../utils/errorHandle.js'
import uniqid from 'uniqid'
import { response } from 'express'

export const createOrder = async (req, res, next) => {
  const { COD, couponApplied } = req.body
  const { _id } = req.user
  try {
    if (!COD) return next(errorHandler(500, 'Create cash order failed'))
    const user = await User.findById(_id)
    const userCart = await Cart.findOne({ orderby: user._id })
    let finalAmount = 0
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount
    } else {
      finalAmount = userCart.cartTotal
    }
    const newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: 'COD',
        amount: finalAmount,
        status: 'Cash on delivery',
        createdAt: Date.now(),
        currency: 'USD'
      },
      orderby: user._id,
      orderStatus: 'Cash on Delivery'
    }).save()

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      }
    })
    const updated = await Product.bulkWrite(update, {})
    return res.status(200).json({status: 'success', order: newOrder})
  } catch (error) {
    next(error)
  }
}

//Lay toan bo order cua 1 nguoi dung
export const getOrders = async (req, res, next) => {
  const { _id } = req.user
  try {
    const userorders = await Order.find({ orderby: _id })
    .populate("products.product")
    .populate("orderby")
    .exec()
    return res.status(200).json({ status: 'success', userorders })
  } catch (error) {
    next(error)
  }
}
//Lay order  cau tat ca nguoi dung
export const getAllOrders = async (req, res, next) => {
  try {
    const alluserorders = await Order.find()
      .populate("products.product")
      .populate("orderby")
      .exec()
    res.json(alluserorders)
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  const orderId = req.params.orderId
  const order = await Order.findOne({_id: orderId, orderby: req.user._id})
  if (!order) { return next(errorHandler(500, 'Order not found'))}
  return res.status(200).json({ status: 'success', order: order})
}

export const updateOrderStatus = async (req, res, next) => {
  const { status } = req.body
  const { orderId } = req.params
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          orderStatus: status,
          'paymentIntent.status': status,
        },
      },
      { new: true }
    )
    return res.status(200).json({status: 'success', updateOrderStatus})
  } catch (error) {
    next(error)
  }
}