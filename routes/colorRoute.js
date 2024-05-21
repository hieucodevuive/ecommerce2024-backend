import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  createColor,
  updateColor,
  getAllColor,
  getColor,
  deleteColor
} from '../controller/colorCtrl.js'

const router = express.Router()

router.post('/', authMiddleware, isAdmin, createColor)
router.put('/update/:colorId', authMiddleware, isAdmin, updateColor)

router.get('/', getAllColor)
router.get('/:colorId', getColor)

router.delete('/delete/:colorId', authMiddleware, isAdmin, deleteColor)
export default router
