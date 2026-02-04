import express from 'express'
import multer from 'multer'
import {
  adminListEvents, adminCreateEvent, adminUpdateEvent, adminDeleteEvent, adminApproveEvent, adminRejectEvent, adminCompleteEvent,
  createTeacherAccount, deleteTeacherAccount, blockStudent, unblockStudent, resetUserPassword,
  analyticsSummary, uploadCertificateTemplate, sendNotification, getNotificationsForUser,
  markAttendance, eventParticipationReport, studentParticipationReport,
  uploadGalleryImage, getGalleryImages, deleteGalleryImage
} from '../controllers/adminController.js'
import { generateCertificatesForEvent, exportEventReportExcel, exportEventReportPDF } from '../controllers/adminController.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

// Events
router.get('/events', requireAuth, requireRole('ADMIN'), adminListEvents)
router.post('/events', requireAuth, requireRole('ADMIN'), adminCreateEvent)
router.put('/events/:id', requireAuth, requireRole('ADMIN'), adminUpdateEvent)
router.delete('/events/:id', requireAuth, requireRole('ADMIN'), adminDeleteEvent)
router.post('/events/:id/approve', requireAuth, requireRole('ADMIN'), adminApproveEvent)
router.post('/events/:id/reject', requireAuth, requireRole('ADMIN'), adminRejectEvent)
router.post('/events/:id/complete', requireAuth, requireRole('ADMIN'), adminCompleteEvent)

// Users
router.post('/users/teachers', requireAuth, requireRole('ADMIN'), createTeacherAccount)
router.delete('/users/teachers/:id', requireAuth, requireRole('ADMIN'), deleteTeacherAccount)
router.post('/users/students/:id/block', requireAuth, requireRole('ADMIN'), blockStudent)
router.post('/users/students/:id/unblock', requireAuth, requireRole('ADMIN'), unblockStudent)
router.post('/users/:id/reset-password', requireAuth, requireRole('ADMIN'), resetUserPassword)

// Analytics
router.get('/analytics', requireAuth, requireRole('ADMIN'), analyticsSummary)

// Certificate template upload
router.post('/certificates/templates', requireAuth, requireRole('ADMIN'), upload.single('file'), uploadCertificateTemplate)

// Notifications
router.post('/notifications', requireAuth, requireRole('ADMIN'), sendNotification)
router.get('/notifications', requireAuth, getNotificationsForUser)

// Attendance
router.post('/attendance', requireAuth, requireRole('ADMIN'), markAttendance)
router.post('/certificates/generate/:id', requireAuth, requireRole('ADMIN'), generateCertificatesForEvent)

// Gallery Images
router.post('/gallery', requireAuth, upload.single('image'), uploadGalleryImage)
router.get('/gallery', getGalleryImages)
router.delete('/gallery/:id', requireAuth, deleteGalleryImage)

// Report exports
router.get('/reports/event/:id/excel', requireAuth, requireRole('ADMIN'), exportEventReportExcel)
router.get('/reports/event/:id/pdf', requireAuth, requireRole('ADMIN'), exportEventReportPDF)
router.get('/reports/student/:id/excel', requireAuth, requireRole('ADMIN'), studentParticipationReport)
router.get('/reports/student/:id/pdf', requireAuth, requireRole('ADMIN'), studentParticipationReport)

// Reports
router.get('/reports/event/:id', requireAuth, requireRole('ADMIN'), eventParticipationReport)
router.get('/reports/student/:id', requireAuth, requireRole('ADMIN'), studentParticipationReport)

export default router
