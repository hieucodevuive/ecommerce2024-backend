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
} from '../controller/userCtrl.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/all-users',authMiddleware, isAdmin, getAllUser)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/:userId',authMiddleware, getUser)
router.delete('/delete/:userId',authMiddleware, deleteUser)
router.put('/update', authMiddleware, updateUser)
router.put('/block-user/:userId', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:userId', authMiddleware, isAdmin, unblockUser)

export default router