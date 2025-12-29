import express from 'express'
import { listEvents, createEvent, deleteEvent, registerForEvent } from '../controllers/eventsController.js'
import { requireAuth } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', listEvents)
router.post('/', requireAuth, createEvent)
router.delete('/:id', requireAuth, deleteEvent)
router.post('/:id/register', requireAuth, registerForEvent)

export default router
