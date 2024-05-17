import { validateMongoDbId } from '../utils/validateMongodbId.js'
import { errorHandler } from '../utils/errorHandle.js'
import Coupon from '../models/couponModel.js'

export const createCoupon = async (req, res, next) => {
  try {
    const newCoupon = await Coupon.create(req.body)
    return res.status(200).json({ status: 'success', newCoupon: newCoupon })
  } catch (error) {
    next(error)
  }
}

export const updateCoupon = async (req, res, next) => {
  validateMongoDbId(req.params.couponId)
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate({ _id: req.params.couponId }, req.body, { new: true })
    return res.status(200).json({ status: 'success', updatedCoupon: updateCoupon })
  } catch (error) {
    next(error)
  }
}

export const getCoupon = async (req, res, next) => {
  validateMongoDbId(req.params.couponId)
  try {
    const coupon = await Coupon.findById(req.params.couponId)
    return res.status(200).json({ status: 'success', coupon: coupon })
  } catch (error) {
    next(error)
  }
}

export const getAllCoupon = async (req, res, next) => {
  try {
    const coupons = await Coupon.find()
    return res.status(200).json({ status: 'success', coupons: coupons })
  } catch (error) {
    next(error)
  }
}

export const deleteCoupon = async (req, res, next) => {
  validateMongoDbId(req.params.couponId)
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete({ _id: req.params.couponId })
    return res.status(200).json({ status: 'success', deletedCoupon: deleteCoupon })
  } catch (error) {
    next(error)
  }
}