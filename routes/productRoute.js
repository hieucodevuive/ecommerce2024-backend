import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  createProduct,
  getProductDetail
} from '../controller/productCtrl.js'

const router = express.Router()

router.post('/create',authMiddleware, isAdmin, createProduct)
router.get('/:productId', getProductDetail)

export default router
