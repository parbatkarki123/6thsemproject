import express from 'express'
import { listEvents, createEvent, updateEvent, deleteEvent, registerForEvent, getEventRegistrations, removeStudentFromEvent } from '../controllers/eventsController.js'
import { requireAuth } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', listEvents)
router.post('/', requireAuth, createEvent)
router.put('/:id', requireAuth, updateEvent)
router.delete('/:id', requireAuth, deleteEvent)
router.post('/:id/register', requireAuth, registerForEvent)
router.get('/:id/registrations', getEventRegistrations)
router.delete('/:eventId/registrations/:userId', requireAuth, removeStudentFromEvent)

export default router
