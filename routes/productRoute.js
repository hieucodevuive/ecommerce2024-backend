import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  createProduct,
  getProductDetail,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist
} from '../controller/productCtrl.js'

const router = express.Router()

router.post('/create',authMiddleware, isAdmin, createProduct)
router.get('/:productId', getProductDetail)
router.get('/', getAllProduct)
router.put('/update/:productId',authMiddleware, isAdmin, updateProduct)
router.put('/addToWishList/:productId',authMiddleware, isAdmin, addToWishlist)
router.delete('/delete/:productId',authMiddleware, isAdmin, deleteProduct)

export default router
