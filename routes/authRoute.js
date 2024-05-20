import express from 'express'
import { 
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress
} from '../controller/userCtrl.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/admin-login', loginAdmin)
router.post('/forgot-password-token', forgotPasswordToken)
router.post('/reset-password/:token', resetPassword)

router.get('/all-users',authMiddleware, isAdmin, getAllUser)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/:userId',authMiddleware, getUser)
router.get('/get-wishlist/:userId',authMiddleware, getWishlist)
router.delete('/delete/:userId',authMiddleware, deleteUser)

router.put('/update/:userId', authMiddleware, updateUser)
router.put('/block-user/:userId', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:userId', authMiddleware, isAdmin, unblockUser)
router.put('/change-password', authMiddleware, updatePassword)
router.put('/save-address', authMiddleware, saveAddress)


export default router