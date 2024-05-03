import express from 'express'
import { createUser } from '../controller/userCtrl.js'

const router = express.Router()

router.post('/register', createUser)


export default router