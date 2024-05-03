import express from 'express'
import { createUser, loginUser, getAllUser, getUser, deleteUser } from '../controller/userCtrl.js'

const router = express.Router()

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/all-users', getAllUser)
router.get('/user/:userId', getUser)
router.delete('/delete/:userId', deleteUser)

export default router