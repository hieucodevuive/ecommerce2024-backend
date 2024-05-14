import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory
} from '../controller/productCategoryCtrl.js'

const router = express.Router()

router.post('/create', authMiddleware, isAdmin, createCategory)

router.get('/:pcategoryId', getCategory)
router.get('/', getAllCategory)

router.put('/update/:pcategoryId', authMiddleware, isAdmin, updateCategory)

router.delete('/delete/:pcategoryId', authMiddleware, isAdmin, deleteCategory)

export default router
