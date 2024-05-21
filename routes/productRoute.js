import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  createProduct,
  getProductDetail,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImage,
  deleteImage
} from '../controller/productCtrl.js'

import {
  uploadPhoto,
  productImgResize
} from '../middlewares/uploadImage.js' 

const router = express.Router()

router.post('/create',authMiddleware, isAdmin, createProduct)
router.get('/:productId', getProductDetail)
router.get('/', getAllProduct)
router.put('/upload-images',authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImage)
router.delete('/delete-images/:id',authMiddleware, isAdmin, deleteImage)
router.put('/update/:productId',authMiddleware, isAdmin, updateProduct)
router.delete('/delete/:productId',authMiddleware, isAdmin, addToWishlist)
router.put('/addToWishList/:productId',authMiddleware, isAdmin, deleteProduct)
router.put('/rating/:productId',authMiddleware, rating)

export default router
