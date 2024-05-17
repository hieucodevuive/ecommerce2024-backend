import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  createCoupon,
  updateCoupon,
  getCoupon,
  getAllCoupon,
  deleteCoupon
} from '../controller/couponCtrl.js'

const router = express.Router()

router.post('/create',authMiddleware, isAdmin, createCoupon)
router.put('/update/:couponId',authMiddleware, isAdmin, updateCoupon)
router.get('/:couponId',authMiddleware, getCoupon)
router.get('/',authMiddleware, getAllCoupon)
router.delete('/delete/:couponId',authMiddleware, isAdmin, deleteCoupon)

export default router
