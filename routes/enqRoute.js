import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
  createEnquiry,
  updateEnquiry,
  getAllEnquiry,
  getEnquiry,
  deleteEnquiry
} from '../controller/enqCtrl.js'

const router = express.Router()

router.post('/', createEnquiry)
router.put('/update/:enquiryId', authMiddleware, isAdmin, updateEnquiry)

router.get('/',authMiddleware, isAdmin, getAllEnquiry)
router.get('/:enquiryId',authMiddleware, isAdmin, getEnquiry)

router.delete('/delete/:enquiryId', authMiddleware, isAdmin, deleteEnquiry)
export default router
