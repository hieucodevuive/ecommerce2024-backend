import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  createProduct,
  getProductDetail,
  getAllProduct,
  updateProduct,
  deleteProduct
} from '../controller/productCtrl.js'

const router = express.Router()

router.post('/create',authMiddleware, isAdmin, createProduct)
router.get('/:productId', getProductDetail)
router.get('/', getAllProduct)
router.put('/update/:productId',authMiddleware, isAdmin, updateProduct)
router.delete('/delete/:productId',authMiddleware, isAdmin, deleteProduct)

export default router
