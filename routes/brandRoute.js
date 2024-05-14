import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  creatBrand,
  updateBrand,
  getAllBrand,
  getBrand,
  deleteBrand
} from '../controller/brandCtrl.js'

const router = express.Router()

router.post('/create',authMiddleware, isAdmin, creatBrand)

router.put('/update/:brandId', authMiddleware, isAdmin, updateBrand)

router.get('/', getAllBrand)
router.get('/:brandId', getBrand)

router.delete('/delete/:brandId', authMiddleware, isAdmin, deleteBrand)


export default router
