import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog
} from '../controller/blogCtrl.js'

const router = express.Router()

router.post('/create', authMiddleware, isAdmin, createBlog)

router.put('/update/:blogId', authMiddleware, isAdmin, updateBlog)
router.put('/like-blog/:blogId', authMiddleware, likeBlog)
router.put('/dislike-blog/:blogId', authMiddleware, dislikeBlog)

router.get('/:blogId', getBlog)
router.get('/', getAllBlog)
router.delete('/delete/:blogId',authMiddleware, isAdmin, deleteBlog)

export default router
