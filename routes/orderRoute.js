import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  createOrder,
  getOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from '../controller/orderCtrl.js'

const router = express.Router()

router.post('/', authMiddleware, createOrder)
router.get('/', authMiddleware, getOrders)
router.get('/get-all-orders', authMiddleware, isAdmin, getAllOrders)
router.get('/get-order/:orderId', authMiddleware, getOrderById)
router.put('/update-order-status/:orderId', authMiddleware, updateOrderStatus)

export default router
