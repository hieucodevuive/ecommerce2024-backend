import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import { 
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory
} from '../controller/blogCategoryCrtl.js'

const router = express.Router()

router.post('/create', authMiddleware, isAdmin, createCategory)

router.get('/:bcategoryId', getCategory)
router.get('/', getAllCategory)

router.put('/update/:bcategoryId', authMiddleware, isAdmin, updateCategory)

router.delete('/delete/:bcategoryId', authMiddleware, isAdmin, deleteCategory)

export default router
