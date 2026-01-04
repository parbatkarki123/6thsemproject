import express from 'express'
import {
  getApprovedEvents,
  registerForApprovedEvent,
  cancelRegistration,
  getRegistrationStatus,
  getStudentRegisteredEvents,
  getStudentCompletedEvents,
  getStudentCertificates,
  downloadCertificate,
  submitFeedback,
  getStudentFeedback,
  getEventFeedback,
  getAllFeedback
} from '../controllers/studentController.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

const router = express.Router()

// ============ Event Registration (Student) ============
router.get('/events/approved', requireAuth, getApprovedEvents)
router.post('/events/:id/register', requireAuth, registerForApprovedEvent)
router.delete('/events/:id/register', requireAuth, cancelRegistration)
router.get('/events/:id/status', requireAuth, getRegistrationStatus)

// ============ Profile & Certificates (Student) ============
router.get('/profile/registered-events', requireAuth, requireRole('STUDENT'), getStudentRegisteredEvents)
router.get('/profile/completed-events', requireAuth, requireRole('STUDENT'), getStudentCompletedEvents)
router.get('/profile/certificates', requireAuth, requireRole('STUDENT'), getStudentCertificates)
router.get('/certificates/:id/download', requireAuth, requireRole('STUDENT'), downloadCertificate)

// ============ Feedback System ============
// Student submit/view feedback
router.post('/feedback', requireAuth, requireRole('STUDENT'), submitFeedback)
router.get('/feedback/my', requireAuth, requireRole('STUDENT'), getStudentFeedback)

// Teacher/Admin view feedback
router.get('/feedback/event/:id', requireAuth, getEventFeedback)
router.get('/feedback/all', requireAuth, requireRole('ADMIN'), getAllFeedback)

export default router
