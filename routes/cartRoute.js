import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon
} from '../controller/cartCtrl.js'

const router = express.Router()

router.post('/', authMiddleware, userCart)
router.get('/cart-detail', authMiddleware, getUserCart)
router.delete('/empty', authMiddleware, emptyCart)
router.put('/apply-coupon', authMiddleware, applyCoupon)

export default router
