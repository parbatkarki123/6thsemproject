import express from 'express'
import { listEvents, createEvent, updateEvent, deleteEvent, registerForEvent, getEventRegistrations, removeStudentFromEvent, submitEventRequest, listTeacherRequests, listTeacherApprovedEvents, getEventRegistrationsForTeacher, downloadParticipantList } from '../controllers/eventsController.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', listEvents)
router.post('/', requireAuth, createEvent)
router.put('/:id', requireAuth, updateEvent)
router.delete('/:id', requireAuth, deleteEvent)
router.post('/:id/register', requireAuth, registerForEvent)
router.get('/:id/registrations', getEventRegistrations)
router.delete('/:eventId/registrations/:userId', requireAuth, removeStudentFromEvent)

// Teacher routes
router.post('/requests', requireAuth, requireRole('TEACHER'), submitEventRequest)
router.get('/requests', requireAuth, requireRole('TEACHER'), listTeacherRequests)
router.get('/approved', requireAuth, requireRole('TEACHER'), listTeacherApprovedEvents)
router.get('/:id/students', requireAuth, requireRole('TEACHER'), getEventRegistrationsForTeacher)
router.get('/:id/participants/download', requireAuth, requireRole('TEACHER'), downloadParticipantList)

export default router
