import express from 'express'
import { register, signin, signinStudent, signinTeacher, signinAdmin, me } from '../controllers/authController.js'
import { requireAuth } from '../middlewares/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/signin', signin)
router.post('/login', signinStudent)
router.post('/teacher/login', signinTeacher)
router.post('/admin/login', signinAdmin)
router.get('/me', requireAuth, me)

export default router
