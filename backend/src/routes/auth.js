import express from 'express'
import { register, signin, me } from '../controllers/authController.js'
import { requireAuth } from '../middlewares/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/signin', signin)
router.get('/me', requireAuth, me)

export default router
